const Sequelize = require('sequelize')
const db = require('../db')

const userMini = db.define('user-minis', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
})

module.exports = userMini