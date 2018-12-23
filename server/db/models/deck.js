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
    }
})

Deck.edit = function(deckId, userId, newDeck) {
  const deck = Deck.findById(deckId)
  console.log(deck)
}

module.exports = Deck