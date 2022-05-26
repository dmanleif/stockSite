const express = require('express');
const bodyParser= require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Stock = require('./models/stock.js')
const { User, validate, validateLogin } = require('./models/user.js')
const bcrypt = require('bcrypt')

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
/*
// GET: alternative for main page
app.get('/stocks', async (req, res) => {
    res.redirect('/')
})
*/

//POST: add a ticker from portfolio
app.post('/stocks', async (req, res) => {
    const newStock = new Stock (req.body)
    await newStock.save()
    let user = await User.findOne({email: 'dmanleif@yahoo.com'})
    console.log(user)
    user.stocks.push(newStock)
    await user.save()
    console.log(user)
    res.redirect('/')
})

// GET: ticker page
app.get('/stocks/:ticker', async (req, res) => {
    const ticker = req.params
    console.log(req.params)
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

// GET: sign up page
app.get('/main/signup', async (req, res) => {
    res.render('signup.ejs')
})

//POST: signup to database
app.post('/users', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('User with that email already exists.');
    }

    const newUser = new User (req.body)

    // Encrypts password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save()
    res.redirect('/')
    
})

// GET: sign in page
app.get('/main/login', async (req, res) => {
    res.render('login.ejs')
})

//POST: user logs in
app.post('/login',  async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    // Validate email
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('Incorrect email or password.');
    }

    // Validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect email or password.');
    }

    res.redirect('/');
}) 

