const router = require('express').Router()
const { Reading } = require('../models')

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