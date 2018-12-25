const Sequelize = require("sequelize");
const db = require('../db')

const Mini = db.define("mini", {
    format: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM,
      values: ['swiss', 'double elimination'],
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
    participants: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: []
    },
    decklists: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: []
    }
})

Mini.join = async function(miniId, userId, decklist) {
  try {
    const mini = await this.findById(miniId)
    if (mini.participants.includes(userId)) {
      throw new Error('user is already in this tournament')
    }
    if (mini.participants.length >= mini.maxPlayers) {
      throw new Error('mini is full')
    }
    const participants = [ ...mini.participants, userId ]
    await mini.update({participants})
    return mini
  } catch(e) {
    console.log(e)
    return false
  }
}

module.exports = Mini