const Sequelize = require("sequelize");
const db = require('../db')
const deckCheck = require('../../../shared/deckCheck')

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
      type: Sequelize.STRING
    }
})

const checkAndHash = deck => {
  if (deck.changed('list')) {
    const {format, list, name} = deck.dataValues
    const {isLegal, hash} = deckCheck(format, list, name)
    if (isLegal) {
      deck.hash = hash
    } else {
      // client side deck checker prevents this from happening
      // log this malicious attempt
      throw new Error(`${deck.id} is not legal for ${deck.format}`)
    }
  }
}

Deck.beforeCreate(checkAndHash)
Deck.beforeUpdate(checkAndHash)

Deck.check = async function({userId, deckId, format}) {
  try {
    const {dataValues: deck} = await Deck.findById(deckId)
    if (deck.format !== format)
      return false
    if (deck.userId !== userId)
      return false
    return {hash: deck.hash, list: deck.list}
  } catch (e) {
    console.error(e)
  }
}

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