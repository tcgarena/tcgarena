const Sequelize = require("sequelize");
const db = require('../db')

const Deck = db.define("deck", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    format: {
      type: Sequelize.STRING,
      allowNull: false
    },
    list: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    hash: {
      type: Sequelize.STRING,
      // allowNull: false
    }
})

Deck.edit = async function(deckId, userId, newDeck) {
  try {
    const deck = await Deck.findById(deckId)
    if (deck.dataValues.userId === userId) {
      await deck.update(newDeck)
      return deck
    } else {
      // should log this malicious attempt somewhere
      throw new Error(`Deck ${deckId} doesn't belong to user ${userId}!`)
    }
  } catch (e) {
    console.error(e)
    throw new Error(`No deck by id ${deckId}`)
  }
}

Deck.delete = async function(deckId, userId) {
  try {
    const deck = await Deck.findById(deckId)
    if (deck.dataValues.userId === userId) {
      deck.destroy()
    } else {
      // should log this malicious attempt somewhere
      throw new Error(`Deck ${deckId} doesn't belong to user ${userId}!`)
    }
  } catch (e) {
    console.error(e)
    throw new Error(`No deck by id ${deckId}`)
  }
}

module.exports = Deck