const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/minis', require('./minis'))
router.use('/decks', require('./decks'))
router.use('/user', require('./user'))
router.use('/data', require('./data'))
router.use('/match', require('./match'))
router.use('/logs', require('./logs'))
router.use('/admin', require('./admin'))

// should never be in production (unless migrating database)
router.use('/server-op', require('./serverOps'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
