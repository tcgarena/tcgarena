const router = require('express').Router()
const {requireLogin, requireJudge1} = require('../middlewares')

// /api/match/result POST
router.post('/result', requireLogin, async (req, res, next) => {
  try {
    const {myScore, opponentScore, miniUuid, matchUuid} = req.body
    const miniEngine = req.app.get('miniEngine')
    const response = await miniEngine.results(req.user.id, miniUuid, matchUuid, {myScore, opponentScore})
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

router.post('/result/judge', requireJudge1, async (req, res, next) => {
  try {
    const {miniUuid, matchUuid, uuid1, uuid2, score1, score2} = req.body
    const miniEngine = req.app.get('miniEngine')
    await miniEngine.judgeResult(miniUuid, matchUuid, uuid1, uuid2, score1, score2)
    res.sendStatus(200)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

module.exports = router