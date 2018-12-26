const User = require('./user')
const Deck = require('./deck')
const Mini = require('./mini')
const DeckMini = require('./deckMini')
const UserMini = require('./userMini')

Deck.belongsTo(User)
User.hasMany(Deck)

User.hasMany(Mini)
Mini.belongsTo(User)

const manyToManyThroughAssociationTable = (tableA, tableB, associationTable) => {
  tableA.belongsToMany(tableB, {
    through: {model: associationTable, unique: false},
    constraints: false
  })
  tableB.belongsToMany(tableA, {
    through: {model: associationTable, unique: false},
    constraints: false
  })
}

manyToManyThroughAssociationTable(Deck, Mini, DeckMini)
manyToManyThroughAssociationTable(User, Mini, UserMini)

module.exports = {
  User,
  Deck,
  Mini,
  UserMini,
  DeckMini
}
