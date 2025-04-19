const jwt = require('jsonwebtoken');
require('dotenv').config()

const ensureAuth = (req, res, next) => {
    const auth = req.headers['authorization'];
    if(!auth){
        return res.status(403).json({message:"Unauthorized, No token provided"});
    }
    try{
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({message:"Unauthorized, Invalid token"});
    }
}

module.exports = ensureAuth;