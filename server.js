const express = require('express');
const bodyParser= require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const app = express();
app.set('view engine', 'ejs')

app.use(methodOverride('_method'))

connectionString = 'mongodb+srv://stocks:Daniel211@stockcluster.nsrmn.mongodb.net/stockDatabase?retryWrites=true&w=majority'
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch(err => {
        console.log("Mongo Connection Error")
        console.log(err)
    })

const Stock = require('./models/stock.js')

// Parses data in post and adds it to body of the request object
app.use(bodyParser.urlencoded({ extended: true }))


// Set up server
app.listen(3000, () => {
    console.log('listening on 3000')
})

// GET: main page
app.get('/', async (req, res) => {
    const stocks = await Stock.find({}, {ticker: 1, _id: 0})
    ticker_array = stocks.map((item) => { return item.ticker })
    ticker_array = [...new Set(ticker_array)];
    res.render('index.ejs', {ticker_array: ticker_array})
})
// GET: alternative for main page
app.get('/stocks', async (req, res) => {
    res.redirect('/')
})

//POST: add a ticker from portfolio
app.post('/stocks', async (req, res) => {
    const newStock = new Stock (req.body)
    await newStock.save()
    res.redirect('/')
})

// GET: ticker page
app.get('/stocks/:ticker', async (req, res) => {
    const ticker = req.params
    const stocks = await Stock.find(ticker)
    res.render('show.ejs', {stocks: stocks})
})

// DELETE: delete stock
app.delete('/stocks/:id', async (req, res) => {
    const { id } = req.params
    const stock = await Stock.findByIdAndDelete(id)
    const stocks_of_type = await Stock.find({ticker: stock.ticker})
    if (stocks_of_type.length == 0) {
        res.redirect('/')
    }
    else {
        res.redirect(`/stocks/${stock.ticker}`)
    }
})

// GET: edit page
app.get('/stocks/:id/:i/edit', async (req, res) => {
    const {id, i} = req.params
    const stock = await Stock.findById(id)
    res.render('edit.ejs', {stock: stock, i: i})
})

// PUT: edit a stock
app.put('/stocks/:id', async (req, res) => { 
    const { id } = req.params
    const updatedStock = await Stock.findByIdAndUpdate(id, req.body)
    res.redirect(`/stocks/${updatedStock.ticker}`)
})