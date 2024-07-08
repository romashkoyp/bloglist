const router = require('express').Router()
const { Blog, User, Session } = require('../models')
const { Op } = require('sequelize')
//const { sequelize } = require('../util/db')
const { tokenExtractor } = require('../util/middleware')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    throw new Error('Blog not found') // Throw error for middleware to catch
  }
  next()
}

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  //console.log(user.id)
  const token = req.headers.authorization.substring(7)
  //console.log(token)

  if (!user) {
    throw new Error('User not found')
  }

  if (user.disabled) {
    throw new Error('Account disabled') 
  }

  const session = await Session.findOne({
    where: {
      userId: user.id,
      token: token
    }
  })

  if (!session) {
    throw new Error('Session not found')
  }

  const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
  if (blog) {
    console.log(blog.toJSON())
    res.status(201).json(blog)
  } else {
    throw new Error('Blog not created')
  }
})

router.get('/', async (req, res) => {
  const where = {};
  console.log(req.query)
  console.log(req.query.search)
  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iRegexp]: `\\m${req.query.search}\\M`
        }
      },
      {
        author: {
          [Op.iRegexp]: `\\m${req.query.search}\\M`
        }
      }
    ]
  }
  
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })

  if (Array.isArray(blogs) && blogs.length !== 0) {
    res.json(blogs)
  } else {
    throw new Error ('No blogs found')
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  //console.log(user.id)
  //console.log(req.blog.userId)
  if (user.disabled) {
    throw new Error('Account disabled')
  }

  if (req.blog.userId && req.blog.userId === user.id) {
    await req.blog.destroy()
    console.log('Blog was deleted')
    res.status(204).end()
  } else {
    throw new Error ('Permission denied, you can delete only your own blogs')
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
    console.log('Likes updated')
  } else {
    throw new Error ('Oops, likes NOT updated')
  }
})

module.exports = router