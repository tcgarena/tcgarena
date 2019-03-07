const router = require('express').Router()
const {User, Deck} = require('../db/models')
const {requireAdmin} = require('../middlewares')

module.exports = router
 
/***
 * WARNING - sensitive user information (not plain text passwords)
 * 
 * this route exposes encrypted user passwords and salts
 * 
 * this route should not be in production and is only 
 * applied temporarily for database migration purposes
 * 
 */ 
// router.get('/seed-data', requireAdmin, async (req, res, next) => {
//   try {
//     const [users, deckObjs] = await Promise.all([User.findAll(), Deck.findAll()])

//     const SENSITIVE_USER_DATA = users.reduce( (SENSITIVE_DATA, user) => {
//       const password = user.password()
//       const salt = user.salt()
//       const data = {password, salt, ...user.dataValues}
//       SENSITIVE_DATA.push(data)
//       return SENSITIVE_DATA
//     }, [])

//     const decks = deckObjs.map(deck => deck.dataValues)

//     res.json({
//       users: SENSITIVE_USER_DATA,
//       decks
//     })
//   } catch (err) {
//     next(err)
//   }
// })