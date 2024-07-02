const router = require('express').Router()
const { User } = require('../models')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  if (user) {
    res.status(201).json(user)
  } else {
    res.status(400).json({ error })
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: // case insensitive
        sequelize.where(sequelize.fn('LOWER', sequelize.col('username')),
        'LIKE', req.params.username.toLowerCase())
    }
  })

  if (!user) {
    throw new Error('Username not found')
  } else {
    user.username = req.body.username
    await user.save()
    res.json(user)
    console.log('Username was updated')
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router