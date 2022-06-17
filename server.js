const express = require('express')
const bodyParser= require('body-parser')
const methodOverride = require('method-override')
const stockRouter = require('./routes/stockRoutes.js')
const userRouter = require('./routes/userRoutes.js')
const indexRouter = require('./routes/indexRoutes.js')
const database = require('./config/database.js')
const session = require('express-session')
const sessionConfig = require('./config/session.js')
const flash = require('connect-flash');
const path = require('path')
const storeResData = require('./middleware/storeResData')

database.connect()

const app = express();

app.use(session(sessionConfig))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))

// Parses data in post and adds it to body of the request object
app.use(bodyParser.urlencoded({ extended: true }))


// Sets up flash and middleware
app.use(flash());
app.use(storeResData)

// Set up server
app.listen(3000, () => {
    console.log('listening on 3000')
})

// Sets up index routes
app.use('/', indexRouter)

// Sets up stock routes
app.use('/stock', stockRouter)

// Sets up user routes
app.use('/user', userRouter)