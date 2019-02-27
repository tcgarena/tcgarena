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
// router.get('/', requireJudge3, async (req, res, next) => {
//   try {
//     const user = await User.findOne({
//       where: {id: req.user.id},
//       include: [{all: true}]
//     })
//     res.json({
//       ...user.dataValues,
//       accessLevel: user.getPerms()
//     })
//   } catch (e) {
//     res.sendStatus(404)
//    }
// })


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

// /api/user/findByCockaName/:name GET
router.get('/findByCockaName/:name', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {cockatriceName: req.params.name},
    })
    res.json(user)
  } catch (e) { res.json({}) }
})


// /api/user/minis/:name GET
router.get('/minis/:name', async (req, res) => {
  try {
    const closedMinis = await Mini.fetchClosedMinis(req.params.name)
    res.json(closedMinis)
  } catch (e) { res.json({}) }
})

module.exports = router
