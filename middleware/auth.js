// change to just validate after works

const { User, validate } = require('./models/user.js')

async function auth (req, res, next) {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        next()
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        res.status(400).send('User with that email already exists.');
        next()
    }
    else {
        next()
    }
}

module.exports = auth;