const Joi = require("joi")
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
    
    if (req.body.password != req.body.password_repeat) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/user/signup')
    }
    
    const { error } = validateUser(req.body);
    if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect('/user/signup')
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        req.flash('error', 'User with that email already exists.');
        return res.redirect('/user/signup')
    }  
    next()
}

module.exports = verifySignup;