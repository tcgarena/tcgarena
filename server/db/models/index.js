const User = require('./user')
const Deck = require('./deck')
const UserMini = require('./userMini')
const Mini = require('./mini')

Deck.belongsTo(User)
User.hasMany(Deck)

// foreign key to which judge created the mini
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

// mini participants and decks
manyToManyThroughAssociationTable(User, Mini, UserMini)

module.exports = {
  User,
  Deck,
  Mini,
  UserMini
}
