const router = require('express').Router()
const { User, Blog, Reading } = require('../models')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })

  //console.log(JSON.stringify(users, null, 2))

  if (Array.isArray(users) && users.length !== 0) {
    res.json(users)
  } else {
    throw new Error ('No users found')
  }
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
  const userId = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: [{
      model: Blog,
      as: 'readings',
      attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
      through: { attributes: [] } // exclude reading table from response 
    }],
  })
  if (userId) {
    res.json(userId)
  } else {
    throw new Error('User not found')
  }
})

module.exports = router