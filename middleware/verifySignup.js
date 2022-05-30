const Joi = require("joi")
const bcrypt = require('bcrypt')
const User = require('../models/user.js')


function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        password_repeat: Joi.ref('password'),
    });
    return schema.validate(user);
}

async function verifySignup (req, res, next) {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('User with that email already exists.');
    }
    // Encrypts password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    
    next()
}

module.exports = verifySignup;