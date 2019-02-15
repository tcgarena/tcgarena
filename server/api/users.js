const router = require('express').Router()
const {User} = require('../db/models')
const {requireLogin, requireAdmin, requireModerator} = require('../middlewares')

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['cockatriceName', 'role']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/all', requireModerator, async (req, res, next) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.put('/role', requireModerator, async (req, res, next) => {
  try {
    const {userId, role} = req.body
    const message = await User.setUserRole(req.user.id, userId, role)
    res.send({message})
  } catch (e) {
    next(e)
  }
})
