const router = require('express').Router()
const {User, UserMini, Mini} = require('../db/models')
const {requireLogin, requireJudge3, requireTC} = require('../middlewares')



// /api/user GET
router.get('/', requireLogin, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {id: req.user.id}
    })
    const {id: _, ...dataValues} = user.dataValues
    res.json({
      ...dataValues,
      accessLevel: user.getPerms()
    })
  } catch (e) {
    res.sendStatus(404)
   }
})

// /api/user/cockaName POST
router.post('/cockaName', requireLogin, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {id: req.user.id}
    })

    await user.update({cockatriceName: req.body.cockatriceName})
    res.status(200).end()
  } catch(e) {
    next(e)
  }
})

// /api/user/minis/:name GET
router.get('/minis/:name', async (req, res) => {
  try {
    const closedMinis = await Mini.fetchClosedMinis(req.params.name)
    res.json(closedMinis)
  } catch (e) { res.json({}) }
})

module.exports = router
