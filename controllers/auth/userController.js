const Joi = require('joi');
const { User } = require("../../models");
const bcrypt = require('bcrypt');
const JwtService = require('../../services/JwtService');
const CustomErrorHandler = require('../../services/CustomErrorHandler');

const register = async (req, res, next) => {
    const registerSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        mobile: Joi.string().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: Joi.ref('password')
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return next(error);
    }

    const { name, email, mobile, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        mobile,
        password: hashedPassword
    });
    let access_token;
    try {
        const checkUser = await User.exists({ email: email, mobile: mobile });
        if (checkUser) {
            return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
        }
        const result = await user.save();
        access_token = await JwtService.sign({ _id: result._id, role: result.role });
    } catch (err) {
        return next(err);
    }

    res.json({ access_token: access_token });

};

const login = async (req, res, next) => {
    const loginSchema = Joi.object({
        mobile: Joi.string().required(),
        password: Joi.string().required(),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    try {
        const user = await User.findOne({ mobile: req.body.mobile });
        if (!user) {
            return next(CustomErrorHandler.wrongCredentials());
        }
        const match =await  bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return next(CustomErrorHandler.wrongCredentials());
        }
        const access_token = await JwtService.sign({ _id: user._id, role: user.role });
        res.json({access_token});
        //  
    }
    catch (err) {
        return next(err);
    }

}

module.exports = {
    register,
    login
};
