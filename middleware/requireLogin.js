async function requireLogin(req, res, next) {
    if (!req.session.user_id) {
        req.session.returnTo = req.originalUrl
        return res.redirect('/user/login')
    }
    next()
}

module.exports = requireLogin