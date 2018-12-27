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
  immutable: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

// untested - unit tests would be nice
const rejectUpdate = row => {
  if (row.dataValues.immutable) 
    throw new Error(`${row.dataValues.userId} cannot update their entry for ${row.dataValues.miniId}`)
  else return row
}

userMini.beforeUpdate(rejectUpdate)

module.exports = userMini