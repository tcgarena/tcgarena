const router = require('express').Router()
const {User} = require('../db/models')
const {requireLogin, requireTC} = require('../middlewares')

// /api/user GET
router.get('/', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {id: req.user.id},
      // include: [{all: true}]
    })
    res.json({
      ...user.dataValues,
      accessLevel: user.getPerms()
    })
  } catch (e) { res.json({}) }
})

router.get('/tc', requireTC, (req, res) => {
  res.json('success!')
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

// /api/user/findByCockaName/:name GET
router.get('/findByCockaName/:name', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {cockatriceName: req.params.name},
    })
    res.json(user)
  } catch (e) { res.json({}) }
})

module.exports = router