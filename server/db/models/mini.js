const Sequelize = require("sequelize");
const db = require('../db')
const Deck = require('./deck')
const UserMini = require('./userMini')

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
    }
})

Mini.join = async function(miniId, userId, deckId) {
  try {
    const {dataValues: deck} = await Deck.findById(deckId)
    
    if (!deck) {
      throw new Error(`no deck by id ${deckId}`)
    }
    
    if (deck.userId !== userId) {
      // log malicious attempt
      throw new Error(`deck ${deckId} does not belong to user ${userId}`)
    }
    
    const mini = await this.findById(miniId)
    
    if (deck.format !== mini.dataValues.format) {
      // log malicious attempt
      throw new Error(`cannot use a ${deck.format} deck in a ${mini.dataValues.format} tournament`)
    }
    
    const userMini = await UserMini.findAll({where: {miniId}})
    const userIds = userMini.map(row => row.dataValues.userId)

    if (userMini.length >= mini.dataValues.maxPlayers) {
      throw new Error(`mini ${miniId} is full`)
    } else if (userIds.includes(userId)) {
      throw new Error(`user ${userId} in already in mini ${miniId}`)
    } else {
      const decklist = deck.list
      const deckhash = deck.hash || 'placeholder'
      UserMini.create({
        userId, miniId, decklist, deckhash
      })
    }
    return mini
  } catch(e) {
    console.log(e)
    return false
  }
}

module.exports = Mini