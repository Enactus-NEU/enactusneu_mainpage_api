const jwt = require("jsonwebtoken")

function verifyAdmin(req, res, next) {
    if (req.path === "/login" || req.method === "GET") return next();

    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) return res.sendStatus(401)

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next()
    } catch (error) {
        return(res.sendStatus(403))
    }

}

module.exports = verifyAdmin