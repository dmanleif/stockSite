const bcrypt = require('bcrypt')

const { User, validate } = require('../models/user.js')

async function verifySignup (req, res, next) {
    const { error } = validate(req.body);
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