const Stock = require('./models/stock.js')


// Display stock form and list of stocks
exports.stock_list = async function(req, res) {
    const stocks = await Stock.find({}, {ticker: 1, _id: 0})
    ticker_array = stocks.map((item) => { return item.ticker })
    ticker_array = [...new Set(ticker_array)];
    res.render('index.ejs', {ticker_array: ticker_array})
}

// Create a stock and add it to portfolio
exports.stock_create_post = async function (req, res) {
    const newStock = new Stock (req.body)
    await newStock.save()
    let user = await User.findOne({email: 'dmanleif@yahoo.com'})
    console.log(user)
    user.stocks.push(newStock)
    await user.save()
    console.log(user)
    res.redirect('/')
}

// Display detail page for a stock
exports.stock_detail = async function (req, res)  {
    const ticker = req.params
    const stocks = await Stock.find(ticker)
    res.render('show.ejs', {stocks: stocks})
}

// Delete a stock
exports.stock_delete = async function (req, res) {
    const { id } = req.params
    const stock = await Stock.findByIdAndDelete(id)
    const stocks_of_type = await Stock.find({ticker: stock.ticker})
    if (stocks_of_type.length == 0) {
        res.redirect('/')
    }
    else {
        res.redirect(`/stocks/${stock.ticker}`)
    }
}

// Display edit form
exports.stock_edit_get = async (req, res) => {
    const {id, i} = req.params
    const stock = await Stock.findById(id)
    res.render('edit.ejs', {stock: stock, i: i})
}

// Edit a stock
exports.stock_edit_post = async function (req, res) { 
    const { id } = req.params
    const updatedStock = await Stock.findByIdAndUpdate(id, req.body)
    res.redirect(`/stocks/${updatedStock.ticker}`)
}