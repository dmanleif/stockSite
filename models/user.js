const mongoose = require("mongoose")
const Joi = require("joi")
const StockSchema = require('./stockarooni.js')

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    stocks: [ StockSchema ]
});

const User = mongoose.model("User", UserSchema)

module.exports = User;