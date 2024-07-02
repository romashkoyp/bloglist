const router = require('express').Router()
const { Blog, User } = require('../models')
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
  const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
  if (blog) {
    console.log(blog.toJSON())
    res.status(201).json(blog)
  } else {
    res.status(400).json({ error })
  }
})

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  res.json(blogs)
})

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  console.log('Blog was deleted')
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
  console.log('Likes were updated')
})

module.exports = router