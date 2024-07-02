const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    throw new Error('Blog not found') // Throw error for middleware to catch
  }
  next()
}

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  if (blog) {
    console.log(blog.toJSON())
    res.status(201).json(blog)
  } else {
    res.status(400).json({ error })
  }
})

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
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