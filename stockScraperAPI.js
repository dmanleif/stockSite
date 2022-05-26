const axios = require("axios");
const mongoose = require('mongoose');

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

async function get_tickers() {
    const stocks = await Stock.find({}, {ticker: 1, _id: 0})
    ticker_array = stocks.map((item) => { return item.ticker })
    ticker_array = [...new Set(ticker_array)]
    return ticker_array;
}



async function get_stock_info(ticker) {
    const options = {
        method: 'GET',
        url: 'https://yahoofinance-stocks1.p.rapidapi.com/stock-prices',
        params: {
          EndDateInclusive: '2022-05-11',
          StartDateInclusive: '2022-05-11',
          Symbol: `${ticker}`,
          OrderBy: 'Ascending'
        },
        headers: {
          'X-RapidAPI-Host': 'yahoofinance-stocks1.p.rapidapi.com',
          'X-RapidAPI-Key': '331b087aadmsh6bf3287f966ae6bp1b1f6ajsnf2ff7eccd5c3'
        }
    };

    stock_info = await axios.request(options)
    stock_info = stock_info.data.results[0]
    
    return stock_info
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function make_email(tickers) {
    currentDate = new Date()
    day = currentDate.getDate()
    month = currentDate.getMonth() + 1
    year = currentDate.getFullYear()
    email_string = `<html><head></head><body>Date: ${month}/${day}/${year}<br><br>`
    
    for (let i = 0; i < tickers.length; ++i) {
        
        stock_info = await get_stock_info(tickers[i])

        email_string += `${tickers[i]} stock closed at a price of $${stock_info.close}.<br>`
        email_string += `It opened at $${stock_info.open}.<br>`
        email_string += `It reached a high of $${stock_info.high}.<br>`
        email_string += `It reached a low of $${stock_info.low}.<br><br>`
        email_string += "</body></html>"
        await sleep(2000)
    }


   return email_string
}

async function send_email(email) {
    const options = {
        method: 'POST',
        url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Host': 'rapidprod-sendgrid-v1.p.rapidapi.com',
          'X-RapidAPI-Key': '331b087aadmsh6bf3287f966ae6bp1b1f6ajsnf2ff7eccd5c3'
        },
        data: `{"personalizations":[{"to":[{"email":"dmanleif@gmail.com"}],"subject":"Stock Portfolio"}],"from":{"email":"from_address@example.com"},"content":[{"type":"text/html","value":"${email}"}]}`
      };
      
      axios.request(options).then(function (response) {
          console.log(response.data);
      }).catch(function (error) {
          console.error(error);
      });
}

async function main() {
    user_tickers = await get_tickers()
    email = await make_email(user_tickers)
    send_email(email)
}

main()