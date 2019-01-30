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

router.put('/result/undo', requireLogin, async (req, res, next) => {
  try {
    const {miniUuid, matchUuid} = req.body
    const miniEngine = req.app.get('miniEngine')
    await miniEngine.removeResult(req.user.id, miniUuid, matchUuid)
    res.sendStatus(200)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.post('/result/deny', requireLogin, async (req, res, next) => {
  try {
    const {miniUuid, matchUuid} = req.body
    const miniEngine = req.app.get('miniEngine')
    await miniEngine.denyResult(req.user.id, miniUuid, matchUuid)
    res.sendStatus(200)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

module.exports = router