const express = require('express')
const verifySignup = require('../middleware/verifySignup.js')
const verifyLogin = require('../middleware/verifyLogin.js')
const user_controller = require('../controllers/userController.js')


const router = express.Router()

// GET: sign up page
router.get('/signup', user_controller.user_signup)

// POST: signup to database
router.post('/signup/post', verifySignup, user_controller.user_create_post)

// GET: sign in page
router.get('/login', user_controller.user_login)

//POST: user logs in
router.post('/login/post', verifyLogin, user_controller.user_login_post)

//POST: user logs out
router.get('/logout', user_controller.user_logout)

module.exports = router;