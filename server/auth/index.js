const router = require('express').Router()
const User = require('../db/models/user')
const fs = require('fs')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({where: {email: req.body.email}})
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong email and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong email and/or password')
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)))
    }
  } catch (err) {
    next(err)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    let role = 'user'

    const {email} = req.body
    if (email ==='benjaminpwagner@gmail.com')
      role = 'admin'

    const newUser = {
      email, role,
      password: req.body.password
    }

    const user = await User.create(newUser)
    req.login(user, err => (err ? next(err) : res.json(user)))

    const now = new Date(Date.now())
    const log = `${now.toDateString()}: ${email} joined the arena as role ${role}\n`
    fs.appendFile("./server/logs/signup.txt", log, (err) => {
      if (err) {
        console.error(err);
        return;
      };
    });

  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/logout', (req, res) => {
  console.log('logout')
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))
