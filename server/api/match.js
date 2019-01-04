const router = require('express').Router()
const {Match} = require('../db/models')

// /api/match/:matchId/report POST
router.post('/:matchId/result', (req, res, next) => {
  res.json(cardData)
})

module.exports = router