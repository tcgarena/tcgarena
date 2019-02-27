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

router.get('/:cockatriceName', async (req, res, next) => {
  try {
    const user = await User.findOne({where: {
      cockatriceName: req.params.cockatriceName
    }})
    if (user) {
      const {id: _, ...dataValues} = user.dataValues
      res.json(dataValues)
    } else {
      res.status(204).end()
    }
  } catch(err) {
    next(err)
  }
})

// /api/user/minis/:cockatriceName GET
router.get('/minis/:cockatriceName', async (req, res) => {
  try {
    const closedMinis = await Mini.fetchClosedMinisByCockaName(req.params.cockatriceName)
    res.json(closedMinis)
  } catch (e) { res.json({}) }
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
