const express = require('express')
const bodyParser= require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const stockRouter = require('./routes/stockRoutes.js')
const userRouter = require('./routes/userRoutes.js')

const app = express();
app.set('view engine', 'ejs')

app.use(methodOverride('_method'))


// Connect to mongodb
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

// Sets up stock routes
app.use('/stock', stockRouter)

// Sets up user routes
app.use('/user', userRouter)