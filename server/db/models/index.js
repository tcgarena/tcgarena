const User = require('./user')
const Deck = require('./deck')
const UserMini = require('./userMini')
const Match = require('./match')
const Mini = require('./mini')

/*****************
 * All db methods that reference other models should go here
 * 
 * Mini methods:
 */

const eagerloadParticipants = async minis => {
  try {
    // useful array of mini ids
    const miniIds = minis.map(mini => mini.dataValues.id)

    // turn the array into an obj
    const miniObjs = minis.reduce( (obj, mini) => {
      // prep objs for eager loading
      obj[mini.dataValues.id] = { ...mini.dataValues, users: {}}
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
      attributes: ['cockatriceName', 'id', 'ELO']
    })

    // key the user array by id for easy access
    const userObjs = users.reduce( (obj, user) => {
      obj[user.dataValues.id] = user.dataValues
      return obj
    },{})

    // sudo eagerload miniObjs.participants
    userMinis.forEach( row => {
      miniObjs[row.dataValues.miniId].users[row.dataValues.userId] = { 
        ...userObjs[row.dataValues.userId],
        deckhash: row.dataValues.deckhash,
        decklist: row.dataValues.decklist
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

Mini.join = async function(miniId, userId, deckId) {
  try {
    const {dataValues: deck} = await Deck.findById(deckId)
    const {dataValues: user} = await User.findById(userId)
    // deck not found
    if (!deck) {
      throw new Error(`no deck by id ${deckId}`)
    }
    
    // deck owned by different user
    if (deck.userId !== userId) {
      // log malicious attempt
      throw new Error(`deck ${deckId} does not belong to user ${userId}`)
    }
    
    const mini = await Mini.findById(miniId)
    
    // deck is wrong format 
    if (deck.format !== mini.dataValues.format) {
      // log malicious attempt
      throw new Error(`cannot use a ${deck.format} deck in a ${mini.dataValues.format} tournament`)
    }
    
    const userMini = await UserMini.findAll({where: {miniId}})
    const userIds = userMini.map(row => row.dataValues.userId)

    // mini is full
    if (userMini.length >= mini.dataValues.maxPlayers) {
      throw new Error(`mini ${miniId} is full`)
    
    // user is already in mini
    } else if (userIds.includes(userId)) {
      throw new Error(`user ${userId} in already in mini ${miniId}`)
    
    // user can join mini
    } else {
      const {ELO, cockatriceName} = user
      const decklist = deck.list
      const deckhash = deck.hash || 'placeholder'
      const userMini = await UserMini.create({
        userId, miniId, decklist, deckhash, ELO, cockatriceName
      })
      return userMini
    }
  } catch(e) {
    console.error(e)
    return false
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
