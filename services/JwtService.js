const {JWT_SECRET,JWT_REFRESH_SECRET } = require('../config');
const jwt = require('jsonwebtoken');

class JwtService{

    static sign(payload, expiry = '365d', secret = JWT_SECRET){
        return jwt.sign(payload, secret, { expiresIn: expiry });
    }

}

module.exports = JwtService;