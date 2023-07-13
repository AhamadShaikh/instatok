const jwt = require("jsonwebtoken")

const middleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(400).json({ error: 'Token not provided' });
        }
        const decoded = jwt.verify(token, "ironman")
        if (!decoded) {
            res.send("invalid credentials")
        }
        req.userId = decoded.userId
        req.name = decoded.name
        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = middleware