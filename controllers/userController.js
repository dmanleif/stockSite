const User = require('../models/user.js')


// Display signup page
exports.user_signup = async function (req, res) {
    res.render('signup.ejs')
}

// Create a user and add it to database
exports.user_create_post = async function (req, res) {
    const newUser = new User (req.body)
    await newUser.save()
    
    // Start user session
    req.session.user_id = newUser.id
    res.redirect('/stock/portfolio')
}

// Display login page
exports.user_login = async function (req, res) {
    res.render('login.ejs')
}

// Recieves login info and redirects to user portfolio
exports.user_login_post =  async function (req, res) {
    res.redirect('/stock/portfolio');
}

// Logs user out
exports.user_logout_post =  async function (req, res) {
    req.session.user_id = null
    res.redirect('/')
}