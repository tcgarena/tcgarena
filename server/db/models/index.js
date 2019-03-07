const User = require('./user')
const Deck = require('./deck')
const UserMini = require('./userMini')
const Match = require('./match')
const Mini = require('./mini')
const uuidv4 = require('uuid/v4')
const arpadELO = require('arpad')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

/*****************
 * All db methods that reference other models should go here
 *
 * Mini methods:
 */

const eagerloadParticipants = async minis => {
  try {
    // useful array of mini ids
    const miniIds = minis.map(mini => mini.dataValues.id)

    const dayMs = 1000*60*60*24    
    const now = Date.now()

    // turn the array into an obj
    const miniObjs = minis.reduce( (obj, mini) => {
      // prep objs for eager loading
      const {id: id, userId: userId, ...dataValues} = mini.dataValues
      const endedAt = new Date(mini.updatedAt).getTime()
      const overFor24hrs = now - endedAt > dayMs
      obj[mini.dataValues.id] = { ...dataValues, overFor24hrs, users: {}}
      return obj
    },{})

    const userMinis = await UserMini.findAll({
      where: {miniId: miniIds}
    })

    // compile unique user ids for lookup
    const userIds = userMinis.reduce( (arr, userMini) => {
      const userId = userMini.dataValues.userId
      if (!arr.includes(userId))
        arr.push(userId)
      return arr
    }, [])

    // grab the relevant users
    const users = await User.findAll({
      where: {id: userIds},
      attributes: ['cockatriceName', 'id']
    })

    // key the user array by id for easy access
    const userObjs = users.reduce( (obj, user) => {
      const {id: _, ...dataValues} = user.dataValues
      obj[user.dataValues.cockatriceName] = dataValues
      return obj
    },{})

    // sudo eagerload miniObjs.participants
    userMinis.forEach( row => {
      miniObjs[row.dataValues.miniId].users[row.dataValues.cockatriceName] = {
        ...userObjs[row.dataValues.userId],
        deckhash: row.dataValues.deckhash,
        cockatriceName: row.dataValues.cockatriceName,
        ELO: row.dataValues.ELO,
        decklist: miniObjs[row.dataValues.miniId].overFor24hrs
          ? row.dataValues.decklist
          : `hidden`
      }
    })

    return miniObjs
  } catch (e) {
    console.error(e)
  }
}


Mini.fetchActive = async function() {
  try {
    // get all open or active minis
    const minis = await Mini.findAll({
      where: {state: ['open', 'active']}
    })

    const miniObjs = await eagerloadParticipants(minis)
    return miniObjs
  } catch (e) {
    console.error(e)
  }
}

Mini.fetchById = async function(miniId) {
  try  {
    const mini = await Mini.findById(miniId)
    // takes an array, easier to workaround it
    const miniObjs = await eagerloadParticipants([mini])
    // de-nest the mini from the returned obj collection
    const miniObj = Object.keys(miniObjs).reduce( (_, miniId) => miniObjs[miniId], {})
    return miniObj
  } catch (e) {
    console.error(e)
  }
}

Mini.fetchClosedMinisByCockaName = async function (cockatriceName) {
  try {
    const {id} = user = await User.findOne({
      where: {cockatriceName},
    })

    const userMinis = await UserMini.findAll({
      where: {userId: id},
    })

    const miniIds = userMinis.reduce((arr, mini) => {
      arr.push(mini.miniId)
      return arr
    }, [])

    const minis = await Mini.findAll({
      where: {
        state: 'closed',
        id: {
          [Op.or]: miniIds
        }
      }
    })

    const closedMinis = await eagerloadParticipants(minis)
    return closedMinis
  } catch(e) {
    console.error(e)
  }
}

Mini.fetchClosedMiniByUuid = async function (uuid) {
  try {
    const mini = await Mini.findOne({
      where: {
        uuid,
        state: 'closed',
      }
    })

    if (mini) {
      // takes an array, easier to workaround it
      const miniObjs = await eagerloadParticipants([mini])
      // de-nest the mini from the returned obj collection
      const miniObj = Object.keys(miniObjs).reduce( (_, miniId) => miniObjs[miniId], {})
      return miniObj
    } else {
      return false
    }
  } catch(e) {
    console.error(e)
  }
}

Mini.leave = async function(miniId, userId) {
  try {
    const userMini = await UserMini.findAll({where: {miniId}})
    const userIds = userMini.map(row => row.dataValues.userId)
    if (userIds.includes(userId)) {
      UserMini.destroy({where: {
        miniId, userId
      }})
    } else {
      throw new Error(`user ${userId} not in mini ${miniId}`)
    }
    return true
  } catch (e) {
    console.error(e)
  }
  return false
}

Match.result = async function(uuid, player1Id, player1score, player2score) {
  try {
    const match = await this.findByUuid(uuid)
    let user1score, user2score, user1Id, user2Id, user1ELO, user2ELO

    if (match.dataValues.user1Id === player1Id) {
      user1score = player1score
      user2score = player2score
      user1Id = match.dataValues.user1Id
      user2Id = match.dataValues.user2Id
      user1ELO = match.dataValues.user1ELO
      user2ELO = match.dataValues.user2ELO
    } else if (match.dataValues.user2Id === player1Id) {
      user1score = player1score
      user2score = player2score
      user1Id = match.dataValues.user2Id
      user2Id = match.dataValues.user1Id
      user1ELO = match.dataValues.user2ELO
      user2ELO = match.dataValues.user1ELO
    } else {
      // should log malicious attempt
      throw new Error (`user ${player1Id} not a part of match ${uuid}`)
    }

    match.update({user1score, user2score})

    const kVal = {default: 16}
    const min_score = 100
    const max_score = 5000

    const elo = new arpadELO(kVal, min_score, max_score);

    const odds_user1_wins = elo.expectedScore(user1ELO, user2ELO);
    const odds_user2_wins = elo.expectedScore(user2ELO, user1ELO);

    let newUser1ELO, newUser2ELO
    if (user1score > user2score) {
      newUser1ELO = elo.newRating(odds_user1_wins, 1.0, user1ELO)
      newUser2ELO = elo.newRating(odds_user2_wins, -1.0, user2ELO)
    } else if (user1score < user2score) {
      newUser1ELO = elo.newRating(odds_user1_wins, -1.0, user1ELO)
      newUser2ELO = elo.newRating(odds_user2_wins, 1.0, user2ELO)
    } else {
      newUser1ELO = user1ELO
      newUser2ELO = user2ELO
    }

    User.update(
      {ELO: newUser1ELO},
      {where: {id: user1Id}}
    )

    User.update(
      {ELO: newUser2ELO},
      {where: {id: user2Id}}
    )

    return {
      [user1Id]: newUser1ELO,
      [user2Id]: newUser2ELO
    }
  } catch (e) {
    console.error(e)
    return {message: 'internal server error'}
  }
}

/*************
 *
 * Hooks that reference outside models go here
 */

// untested - unit tests would be nice
// prevents users from changing their decklist/hash once tournament has started
const rejectEntryUpdate = async row => {
  if (row.changed('decklist') || row.changed('deckhash')) {
    try {
      const {userId, miniId} = row.dataValues
      const {dataValues: mini} = await Mini.findById(miniId)
      if (mini.state !== 'open') {
        throw new Error(`${userId} cannot update their entry for ${miniId}`)
      } else {
        return row
      }
    } catch (e) {
      console.error(e)
    }
  } else {
    return row
  }

}

UserMini.beforeUpdate(rejectEntryUpdate)


 //

/***********************
 * Associations go here
 *
 */

Deck.belongsTo(User)
User.hasMany(Deck)

Match.belongsTo(Mini)
Mini.hasMany(Match)

// anticipating a few more associations of this type
const manyToManyThroughAssociationTable = (tableA, tableB, associationTable) => {
  tableA.belongsToMany(tableB, {
    through: {model: associationTable, unique: false},
    constraints: false
  })
  tableB.belongsToMany(tableA, {
    through: {model: associationTable, unique: false},
    constraints: false
  })
}

// note: there are two associations between user and mini
// first association gives minis a reference to their creator
User.hasMany(Mini)
Mini.belongsTo(User)
// second association says which users are in a mini + stores their decklist/hash
manyToManyThroughAssociationTable(User, Mini, UserMini)



module.exports = {
  User,
  Deck,
  Mini,
  UserMini,
  Match
}
