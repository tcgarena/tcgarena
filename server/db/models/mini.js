const Sequelize = require("sequelize");
const db = require('../db')

const Mini = db.define("mini", {
    state: {
      type: Sequelize.ENUM,
      values: ['active', 'open', 'closed'],
      defaultValue: 'open'
    },
    format: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM,
      values: ['swiss', 'single elimination', 'double elimination'],
      allowNull: false
    },
    timePerRoundMins: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    maxPlayers: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    round: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
})

module.exports = Mini