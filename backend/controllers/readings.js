const router = require('express').Router()
const { Reading, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const readingFinder = async (req, res, next) => {
  req.reading = await Reading.findByPk(req.params.id)
  if (!req.reading) {
    throw new Error('Not found')
  }
  next()
}

router.put('/:id', tokenExtractor, readingFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (user.disabled) {
    throw new Error('Account disabled')
  }
  //console.log(user.id)
  //console.log(req.reading)
  if (req.reading && req.reading.userId === user.id) {
    req.reading.read = req.body.read
    await req.reading.save()
    res.json(req.reading)
    console.log('Read status updated')
  } else {
    throw new Error ('Permission denied, you can mark blog as read/unread only from your own reading list')
  }
})

router.post('/', async (req, res) => {
  //console.log(req.body)
  const readingList = await Reading.create(req.body)

  if (readingList) {
    res.status(201).json(readingList)
  } else {
    throw new Error('Blog not added to the reading list')
  }
})

module.exports = router