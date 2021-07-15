const express = require('express')
const router = express.Router()

/** Las rutas deben de tener el mismo nombre del archivo ejemplo user.js localhost/user/HIJO */

router.use('/users', require('./users'))

router.use('/orders', require('./orders'))

router.use('/check', require('./check'))

module.exports = router