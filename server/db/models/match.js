const Sequelize = require('sequelize')
const db = require('../db')

const Match = db.define('match', {
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
      isIn: [0,1,2]
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
      isIn: [0,1,2]
    },
    allowNull: true
  },
  score: {
    type: Sequelize.TEXT,
    defaultValue: null
  },
  winner: {
    type: Sequelize.INTEGER,
    defaultValue: null
  }
})

const preventDuplicateData = match => {
  // console.log('miniId', match)
}

Match.beforeCreate(preventDuplicateData)
Match.beforeUpdate(preventDuplicateData)

Match.prototype.result = function(userId, result) {
  
}

module.exports = Match