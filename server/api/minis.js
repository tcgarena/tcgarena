const router = require('express').Router()
const { Mini, UserMini } = require('../db/models')
const {
  requireLogin,
  requireJudge1
} = require('../middlewares')

// /api/minis GET
router.get('/', requireLogin, async (req, res, next) => {
  try {
    const miniEngine = req.app.get('miniEngine')
    const minis = miniEngine.getMinis()
    res.json(minis)
  } catch (e) { next(e) }
})

// /api/minis/:miniId GET
router.get('/:miniId', requireLogin, async (req, res, next) => {
  try {
    const miniEngine = req.app.get('miniEngine')
    const mini = miniEngine.getMini(req.params.miniId)
    res.json(mini)
  } catch (e) {
    res.json({ message: `no active mini by id ${req.params.miniId}`})
   }
})

// /api/minis/closed/:miniId GET
router.get('/closed/:miniUuid', requireLogin, async (req, res, next) => {
  try {
    const mini = await Mini.findOne({where: {uuid: req.params.miniUuid}})
    res.json(mini)
  } catch (e) {
    res.json({ message: `no mini by id ${req.params.miniId}`})
   }
})


// /api/minis/:miniId DELETE
router.delete('/:miniId', requireJudge1, async (req, res, next) => {
  try {
    const miniEngine = req.app.get('miniEngine')
    await miniEngine.closeMini(req.user.id, req.params.miniId)
    res.sendStatus(200)
  } catch (e) {
    console.error(e)
    res.json({ message: `no active mini by id ${req.params.miniId}`})
   }
})

// /api/minis POST
router.post('/', requireJudge1, async (req, res, next) => {
  try {
    const newMini = req.body
    newMini.judgeId = req.user.id
    newMini.judgeName = req.user.cockatriceName
    const miniEngine = req.app.get('miniEngine')
    const mini = await miniEngine.createMini(newMini)
    if (mini) res.status(200).json(mini)
    else res.sendStatus(500)
  } catch (e) {
    next(e)
  }
})

// /api/minis/:miniId/join PUT
router.put('/:miniId/join', requireLogin, async (req, res, next) => {
  try {
    const miniEngine = req.app.get('miniEngine')
    await miniEngine.joinMini(
      req.user.id,
      req.params.miniId,
      req.body.deckId,
    )
    res.sendStatus(200)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
   }
})


// /api/minis/:miniId/leave PUT
router.put('/:miniId/leave', requireLogin, async (req, res, next) => {
  try {
    const miniEngine = req.app.get('miniEngine')
    miniEngine.leaveMini(req.user.id, req.params.miniId)
    res.sendStatus(200)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
   }
})

router.put('/:miniUuid/start', requireJudge1, async (req, res, next) => {
  try {
    const miniEngine = req.app.get('miniEngine')
    await miniEngine.startMini(
      req.user.id,
      req.params.miniUuid
    )
    res.sendStatus(200)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.put('/:miniUuid/next-round', requireJudge1, async (req, res, next) => {
  try {
    const miniEngine = req.app.get('miniEngine')
    await miniEngine.nextRound(
      req.user.id,
      req.params.miniUuid
    )
    res.sendStatus(200)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

module.exports = router
