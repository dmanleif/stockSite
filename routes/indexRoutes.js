const express = require('express')
const router = express.Router()
const index_controller = require('../controllers/indexController.js')

// GET: main page for users
router.get('/', index_controller.main)

module.exports = router;