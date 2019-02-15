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

router.put('/role', requireModerator, async (req, res, next) => {
  try {
    User.setUserRole(req.user.id, req.body.role)
    res.send(200)
  } catch (e) {
    next(e)
  }
})
