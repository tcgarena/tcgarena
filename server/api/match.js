const router = require('express').Router()
const {Match} = require('../db/models')
const {requireLogin} = require('../middlewares')

// /api/match/:matchId/report POST
router.post('/:matchId/result', requireLogin, async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.matchId)
    const response = await match.result(req.user.id, req.body)
    res.json(response)
  } catch (e) {
    next(e)
  }
})

module.exports = router