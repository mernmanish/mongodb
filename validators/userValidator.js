const Joi = require('joi');

// user send otp validation schema
const otpSchema = Joi.object({
    mobile: Joi.string().min(10).max(10).required()
});

// user verify otp validation schema
const verifyOtpSchema = Joi.object({
    mobile: Joi.string().min(10).max(10).required(),
    otp: Joi.string().min(6).max(6).required()
});

// user registration validation schema
const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().min(10).max(10).required(),
    role: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    repeat_password: Joi.ref('password')
});

// user login validation schema
const loginSchema = Joi.object({
    mobile: Joi.string().min(10).max(10).required(),
    password: Joi.string().required(),
});

// token refresh schema
const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().required()
});

// logout schema
const logOutSchema = Joi.object({
    refresh_token: Joi.string().required()
});



module.exports = {
    otpSchema,
    verifyOtpSchema,
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    logOutSchema
    
}