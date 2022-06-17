const User = require('../models/user.js')
const bcrypt = require('bcrypt')

// Display signup page
exports.user_signup = async function (req, res) {
    res.render('users/signup.ejs')
}

// Create a user and add it to database
exports.user_create_post = async function (req, res) {
    // Encrypts password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const newUser = new User (req.body)
    await newUser.save()
    
    // Start user session
    req.session.user_id = newUser._id

    req.flash('success', 'Sucessfully Registered')
    res.redirect('/stock/portfolio')
}

// Display login page
exports.user_login = async function (req, res) {
    res.render('users/login.ejs')
}

// Recieves login info and redirects to user portfolio
exports.user_login_post =  async function (req, res) {

    req.flash('success', 'Sucessfully Logged In')
    const redirectUrl = req.session.returnTo || '/stock/portfolio'
    delete req.session.returnTo
    res.redirect(redirectUrl);
}

// Logs user out
exports.user_logout =  async function (req, res) {
    req.session.user_id = null
    res.redirect('/')
}