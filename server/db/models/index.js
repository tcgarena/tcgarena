const User = require('./user')
const Deck = require('./deck')
const Mini = require('./mini')

Deck.belongsTo(User)
User.hasMany(Deck)

User.hasMany(Mini)
Mini.belongsTo(User)

module.exports = {
  User,
  Deck,
  Mini
}
