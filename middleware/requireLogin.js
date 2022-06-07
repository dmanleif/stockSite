async function requireLogin(req, res, next) {
    if (!req.session.user_id) {
       return res.redirect('/')
    }
    next()
}

module.exports = requireLogin