const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const secret = process.env.JWT_ACCESS_SECRET;
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            // return res.status(403).json({message: "User is not authorized"})
            return res.redirect(`${clientURL}/login`).json({message: "User is not authorized"});

        }
        const userID = jwt.verify(token, secret)
        req.userData = userID
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: "User is not authorized"})
    }
};
