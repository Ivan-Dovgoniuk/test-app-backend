const jwt = require('jsonwebtoken')

const clientURL = process.env.NODE_ENV === 'development' ? process.env.DEV_CLIENT_URL : process.env.PRO_CLIENT_URL

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const secret = process.env.JWT_ACCESS_SECRET;
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.redirect(`${clientURL}/login`)

        }
        const userID = jwt.verify(token, secret)
        req.userData = userID
        next()
    } catch (e) {
        return res.redirect(`${clientURL}/login`)
    }
};
