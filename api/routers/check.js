const express = require('express')
const router = express.Router()

const { postItem } = require('../controllers/check/postItem')

router.post('/:id', postItem)

module.exports = router