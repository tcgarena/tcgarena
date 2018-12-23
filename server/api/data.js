const router = require('express').Router()
const cardData = require('./data/cardData')
const historic = require('./data/historic')

router.get('/cards', (req, res, next) => {
  res.json(cardData)
})

router.get('/historic', (req, res, next) => {
  res.json(historic)
})

module.exports = router