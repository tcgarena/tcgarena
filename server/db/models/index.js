const User = require('./user')
const Deck = require('./deck')
const Mini = require('./mini')

Deck.belongsTo(User)
User.hasMany(Deck)

User.hasMany(Mini)
Mini.belongsTo(User)

User.belongsToMany(Mini, {through: 'UserMini'})
Mini.belongsToMany(User, {through: 'UserMini'})
Deck.belongsToMany(Mini, {through: 'DeckMini'})
Mini.belongsToMany(Deck, {through: 'DeckMini'})



module.exports = {
  User,
  Deck,
  Mini
}
