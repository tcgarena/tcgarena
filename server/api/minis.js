const router = require('express').Router()
const { Mini } = require('../db/models')
const {
  requireLogin, 
  requireJudge1
} = require('../middlewares')

// /api/minis GET
router.get('/', requireLogin, async (req, res, next) => {
  try {
    const mini = await Mini.findAll()
    res.json(mini)
  } catch (e) { next(e) }
})

// /api/minis:miniId GET
router.get('/:miniId', requireLogin, async (req, res, next) => {
  try {
    const mini = await Mini.findById(req.params.miniId)
    res.json(mini)
  } catch (e) { 
    res.json({ message: `no mini by id ${req.params.miniId}`})
   }
})

// /api/minis POST
router.post('/', requireJudge1, async (req, res, next) => {
  try {
    const newMini = req.body
    if (!newMini.userId) newMini.userId = req.user.id
    const miniEngine = req.app.get('miniEngine')
    const mini = miniEngine.createMini(newMini)
    if (mini) res.status(200).json(mini)
    else res.sendStatus(500)
  } catch (e) { console.log(e) }
})


// /api/minis/:miniId/join PUT
router.put('/:miniId/join', requireLogin, async (req, res, next) => {
  try {
    const miniEngine = req.app.get('miniEngine')
    miniEngine.joinMini(req.user.id, req.params.miniId)
    res.sendStatus(200)
  } catch (e) { 
    console.log(e)
    res.sendStatus(500)
   }
})

module.exports = router