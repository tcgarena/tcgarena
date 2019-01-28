const router = require('express').Router()
const fs = require('fs')
const {requireAdmin} = require('../middlewares')

router.get('/signup', requireAdmin, async (req, res, next) => {
  try {
    const rawLogs = fs.readFileSync('./server/logs/signup.txt', 'utf-8')
    res.json(rawLogs.split('\n'))
  } catch (e) {
    next(e)
  }
})


module.exports = router