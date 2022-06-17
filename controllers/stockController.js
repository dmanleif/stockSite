const Stock = require('../models/stock.js')
const User = require('../models/user.js')


// Display stock form and list of stocks
exports.stock_list = async function(req, res) {
    let user = await User.findById(req.session.user_id)
    if (user) {
        user = await user.populate('stocks')
        ticker_array = user.stocks.map((item) => { return item.ticker })
        ticker_array = [...new Set(ticker_array)];
        res.render('stocks/portfolio.ejs', {ticker_array: ticker_array})
    }
}

// Create a stock and add it to portfolio
exports.stock_create_post = async function (req, res) {
    const newStock = new Stock (req.body)
    let user = await User.findById(req.session.user_id)
    user.stocks.push(newStock)
    await newStock.save()
    await user.save()
    res.redirect('/stock/portfolio')
}

// Display detail page for a stock
exports.stock_detail = async function (req, res)  {

    let user = await User.findById(req.session.user_id)
    if (user) {
        user = await user.populate('stocks')
        const ticker = req.params.ticker
        let stocks = user.stocks || []
        stocks = stocks.filter(obj => {
            return obj.ticker === ticker;
        });
        res.render('stocks/show.ejs', {stocks: stocks})
    }   
}

// Delete a stock
exports.stock_delete = async function (req, res) {
    const { id } = req.params

    
    let user = await User.findById(req.session.user_id)
    user.stocks.pull(id)
    user.save()
    
    const stock = await Stock.findByIdAndDelete(id)
    
    user = await user.populate('stocks')
    let stocks = user.stocks || []
    stocks_of_type = stocks.filter(obj => {
        return obj.ticker === stock.ticker;
    });

    if (stocks_of_type.length == 0) {
        res.redirect('/stock/portfolio')
    }
    else {
        res.redirect(`/stock/${stock.ticker}`)
    }
}

// Display edit form
exports.stock_edit_get = async (req, res) => {

    const {id, i} = req.params
    const stock = await Stock.findById(id)
    res.render('stocks/edit.ejs', {stock: stock, i: i})
}

// Edit a stock
exports.stock_edit_put = async function (req, res) { 
    const { id } = req.params
    const updatedStock = await Stock.findByIdAndUpdate(id, req.body)
    res.redirect(`/stock/${updatedStock.ticker}`)
}