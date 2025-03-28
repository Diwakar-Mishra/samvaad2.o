const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY; // Same secret key used while signing the token

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
        return res.status(401).json({ error: "Unauthorized! No token provided." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Store user data in request object
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token!" });
    }
};

module.exports = verifyToken;
