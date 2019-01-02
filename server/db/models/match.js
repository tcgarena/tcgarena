const Sequelize = require('sequelize')
const db = require('../db')

const Match = db.define('match', {
  userId1: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  userId2: {
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
  console.log('miniId', match)
}

Match.beforeCreate(preventDuplicateData)
Match.beforeUpdate(preventDuplicateData)

module.exports = Match