const Sequelize = require('sequelize')
const db = require('../db')

const deckMini = db.define('deck-minis', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
})

module.exports = deckMini