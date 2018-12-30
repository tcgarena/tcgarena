const Sequelize = require('sequelize')
const db = require('../db')

const userMini = db.define('user-minis', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  decklist: {
    type: Sequelize.TEXT
  },
  deckhash: {
    type: Sequelize.STRING
  },
  ELO: {
    type: Sequelize.INTEGER
  },
  cockatriceName: {
    type: Sequelize.STRING
  }
})

module.exports = userMini