const router = require('express').Router()
const {requireLogin} = require('../middlewares')

// /api/match/result POST
router.post('/result', requireLogin, async (req, res, next) => {
  try {
    const {myScore, opponentScore, miniUuid, matchUuid} = req.body
    const miniEngine = req.app.get('miniEngine')
    response = await miniEngine.results(req.user.id, miniUuid, matchUuid, {myScore, opponentScore})
    res.json(response)
  } catch (e) {
    next(e)
  }
})

module.exports = router