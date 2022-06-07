const express = require('express')
const stock_controller = require('../controllers/stockController.js')
const requireLogin = require('../middleware/requireLogin.js')

const router = express.Router()

// Applying middleware to confirm user is logged in
router.use(requireLogin)

// GET: stock main page
router.get('/portfolio', stock_controller.stock_list)

//POST: add a ticker to portfolio
router.post('/create', stock_controller.stock_create_post)

// GET: stock detail page
router.get('/:ticker', stock_controller.stock_detail)

// DELETE: delete stock
router.delete('/:id/delete', stock_controller.stock_delete)

// GET: edit page
router.get('/:id/:i/update', stock_controller.stock_edit_get)

// PUT: edit a stock
router.put('/:id/update', stock_controller.stock_edit_put)

module.exports = router;