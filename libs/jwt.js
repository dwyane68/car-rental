const jwt  = require('jsonwebtoken');
const SECRET = require('../config/jwt_secret');

exports.generateToken = (payload) => {
    return jwt.sign(payload, SECRET,{
        expiresIn: '30d'
    })
};

exports.generateShortToken = (payload) => {
    return jwt.sign(payload, SECRET,{
        expiresIn: '1h'
    })
};

exports.generateVeryShortToken = (payload) => {
    return jwt.sign(payload, SECRET,{
        expiresIn: 10*60
    })
};


exports.verifyToken = (token, cb) => {
    jwt.verify(token, SECRET, cb);
};

exports.decodeToken = (token) => {
    return jwt.decode(token);
};
