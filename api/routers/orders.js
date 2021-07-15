const express = require('express')
const router = express.Router()

const { getItem } = require('../controllers/orders/getItem')
const { postItem } = require('../controllers/orders/postItem')
const { updateItem } = require('../controllers/orders/updateItem')

router.get('/:id', getItem)

router.post('/', postItem)

router.patch('/:id', updateItem)

module.exports = router