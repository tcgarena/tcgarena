const router = require('express').Router()
const cardData = require('./data/cardData')

router.get('/cards', (req, res, next) => {
  res.json(cardData)
})

module.exports = router