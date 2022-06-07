const mongoose = require('mongoose')

// Connect to mongodb
connectionString = 'mongodb+srv://stocks:Daniel211@stockcluster.nsrmn.mongodb.net/stockDatabase?retryWrites=true&w=majority'
exports.connect = function () { 
    mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch(err => {
        console.log("Mongo Connection Error")
        console.log(err)
    })
}
