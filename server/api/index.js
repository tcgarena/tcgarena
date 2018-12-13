const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/minis', require('./minis'))
router.use('/decks', require('./decks'))
router.use('/user', require('./user'))
router.use('/data', require('./data'))

router.get('/test', (req,res) => {
  setTimeout( ()=>req.app.io.emit('test', 'something'), 2000)
  res.json('nothing')
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
