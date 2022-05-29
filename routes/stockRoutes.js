const express = require('express')
const router = express.Router()

const stock_controller = require('../controllers/stockController.js')

router.get('/stock/portfolio', stock_controller.stock_list)