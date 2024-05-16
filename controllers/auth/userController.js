const Joi = require('joi');
const { User } = require("../../models");


const register = async (req, res, next) => {
    const registerSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: Joi.ref('password')
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return next(error);
    }

    try {
        const checkUser = await User.exists({ email: req.body.email });
        if (checkUser) {
            return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
        }
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    register
};
