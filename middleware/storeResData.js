const flash = require('connect-flash');

async function storeFlashMsg (req, res, next) {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.session.user_id
    next()
}

module.exports = storeFlashMsg;