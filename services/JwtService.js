const {JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');

class JwtService{

    static sign(params, expiry = '60', secret = JWT_SECRET){
        return jwt.sign(params, secret, { expiresIn: expiry });
    }
}

module.exports = JwtService;