const jwt = require('jsonwebtoken')

module.exports = auth = (req, res, next) => {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({
        success: false,
        error: 'No token, authorization denied'
    })

    jwt.verify(token, process.env.JWTSECRET, (err, user) => {
        if (err) return res.status(401).json({
            success: false,
            error: 'Token is not valid'
        })
        req.user = user
        next()
    })
}