const Sequelize = require('sequelize')
const db = require('../db')

const Match = db.define('match', {
  uuid: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  user1Id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  user2Id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  user1decklist: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  user1deckhash: {
    type: Sequelize.STRING,
    allowNull: true
  },
  user1ELO: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  user1score: {
    type: Sequelize.INTEGER,
    validate: {
      isIn: {
        args: [[0,1,2]]
      }
    },
    allowNull: true
  },
  user2decklist: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  user2deckhash: {
    type: Sequelize.STRING,
    allowNull: true
  },
  user2ELO: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  user2score: {
    type: Sequelize.INTEGER,
    validate: {
      isIn: {
        args: [[0,1,2]]
      }
    },
    allowNull: true
  }
})

Match.findByUuid = async function(uuid) {
  try {
    const match = await this.findOne({where: {uuid}})
    return match
  } catch (e) {
    console.error(e)
  }
}

const preventDuplicateData = match => {
  // console.log('miniId', match)
}

Match.beforeCreate(preventDuplicateData)
Match.beforeUpdate(preventDuplicateData)

Match.result = async function(uuid, player1Id, player1score, player2score) {
  try {
    const match = await this.findByUuid(uuid)
    let user1score, user2score
  
    if (match.dataValues.user1Id === player1Id) {
      user1score = player1score
      user2score = player2score
    } else if (match.dataValues.user2Id === player1Id) {
      user1score = player2score
      user2score = player1score
    } else {
      // should log malicious attempt
      throw new Error (`user ${player1Id} not a part of match ${uuid}`)
    }

    await match.update({user1score, user2score})
    return {message: 'result finalized'}
  } catch (e) {
    console.error(e)
    return {message: 'something went wrong'}
  }
}

module.exports = Match