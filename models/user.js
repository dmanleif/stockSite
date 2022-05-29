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

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        password_repeat: Joi.ref('password'),
    });
    return schema.validate(user);
}
/*
function validateLogin(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}
*/

exports.User = User;
exports.validate = validateUser;
//exports.validateLogin = validateLogin;
