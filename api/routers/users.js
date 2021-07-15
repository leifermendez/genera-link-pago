const express = require('express')
const router = express.Router()

const { getItem } = require('../controllers/users/getItem')
const { postItem } = require('../controllers/users/postItem')

router.get('/', getItem)

router.post('/', postItem)

module.exports = router