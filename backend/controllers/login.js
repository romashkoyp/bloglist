const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'mypassword'

  if (!(user && passwordCorrect)) {
    throw new Error('invalid username or password')
  }

  if (user.disabled) {
    throw new Error('Account disabled')
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, SECRET)

  await Session.create({
    userId: user.id,
    token
  })

  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router