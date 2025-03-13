const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require("../model/user.model");


module.exports.checkAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Token not found' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    try {
        const decodedJwtToken = jwt.verify(token, process.env.JWT_SECRET);

        const id = decodedJwtToken._id;
        let user = await User.findById({_id: id});

        
        if (!user) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};