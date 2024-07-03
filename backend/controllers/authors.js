const router = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    group: ['author'],
    order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']]
  })

  if (Array.isArray(authors) && authors.length !== 0) {
    res.json(authors)
  } else {
    throw new Error('No authors found')
  }
})

module.exports = router