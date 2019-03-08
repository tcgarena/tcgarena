const router = require('express').Router()
const db = require('../db')
const {User, Deck} = require('../db/models')
const {requireAdmin} = require('../middlewares')

module.exports = router
 
/***
 * WARNING - sensitive user information (not plain text passwords)
 * 
 * this file exposes encrypted user passwords / salts
 * and allows admins to drop the database
 * 
 * these routes should not be in production and are only 
 * applied temporarily for database migration purposes
 * 
 */

router.get('/seed-data', requireAdmin, async (req, res, next) => {
  try {
    const [users, deckObjs] = await Promise.all([User.findAll(), Deck.findAll()])

    const SENSITIVE_USER_DATA = users.reduce( (SENSITIVE_DATA, user) => {
      const password = user.password()
      const salt = user.salt()
      const data = {password, salt, ...user.dataValues}
      SENSITIVE_DATA.push(data)
      return SENSITIVE_DATA
    }, [])

    const decks = deckObjs.map(deck => deck.dataValues)

    res.json({
      users: SENSITIVE_USER_DATA,
      decks
    })
  } catch (err) {
    next(err)
  }
})

router.post('/seed', requireAdmin, async (req, res, next) => {
  try {
    console.log('hm')
    await db.sync({force: true})
    console.log('db synced!')
    
    const users = await Promise.all(req.body.users.map(user => User.create(user, {hooks: false})))
    const decks = await Promise.all(req.body.decks.map(deck => Deck.create(deck, {hooks: false})))
    
    // req.logout()
    // req.session.destroy()
  
    console.log(`seeded ${users.length} users`)
    console.log(`seeded ${decks.length} decks`)

    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
})