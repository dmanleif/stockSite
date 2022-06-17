const Joi = require("joi")
const bcrypt = require('bcrypt')
const User = require('../models/user.js')

function validateLogin(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}

async function verifyUser (req, res, next) {
    const { error } = validateLogin(req.body);
    if (error) {
         req.flash('error', error.details[0].message);
         return res.redirect('/user/login')
    }
    // Validate email
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('error', 'Incorrect email or password.');
        return res.redirect('/user/login');
    }
    // Validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        req.flash('error', 'Incorrect email or password.');
        return res.redirect('/user/login');
    }
    
    // Start user session
    req.session.user_id = user.id
    next()
}

module.exports = verifyUser