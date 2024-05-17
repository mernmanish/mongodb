const Joi = require('joi');
const { User } = require("../../models");
const bcrypt = require('bcrypt');
const JwtService = require('../../services/JwtService');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { generateOtp,validateOtp } = require('../../services/userService');

//send otp
const sendOtp = async (req, res, next) => {
    const otpSchema = Joi.object({
        mobile: Joi.string().min(10).max(10).required()
    });

    const { error } = otpSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { mobile} = req.body;
    try{
        const user =await User.findOne({mobile: mobile});
        if(user){
            return next(CustomErrorHandler.alreadyExist('Mobile No already exists'))
        }
        else{
            const data = await generateOtp(mobile);
            res.send({
                message: 'otp send successfully'
            });
        }
    }
    catch(err)
    {
        return next(err);
    }
}

//verifyOtp
const verifyOtp = async (req, res, next) => {
    const verifyOtpSchema = Joi.object({
        mobile: Joi.string().min(10).max(10).required(),
        otp: Joi.string().min(6).max(6).required()
    });
    const {error} = verifyOtpSchema.validate(req.body);
    if(error){
        return next(error);
    }
    const {mobile, otp} = req.body;
    try{
        const userOtp = await validateOtp(mobile,otp);
        if(userOtp){
            res.status(200).send({
                message: 'otp verifed successfully'
            });
        }
        else{
            res.status(401).send({
                message: 'invalid otp'
            })
        }
    }
    catch(err){
        return next(err);
    }
};

//registred user
const register = async (req, res, next) => {
    const registerSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        mobile: Joi.string().min(10).max(10).required(),
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
            return next(CustomErrorHandler.alreadyExist('This user already registred'));
        }
        const result = await user.save();
        access_token = await JwtService.sign({ _id: result._id, role: result.role });
    } catch (err) {
        return next(err);
    }

    res.json({ access_token: access_token });
};


//login user
const login = async (req, res, next) => {
    const loginSchema = Joi.object({
        mobile: Joi.string().min(10).max(10).required(),
        password: Joi.string().required(),
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    try {
        const user = await User.findOne({ mobile: req.body.mobile });
        if (!user) {
            return next(CustomErrorHandler.dataNotExist('Mobile No not registred'));
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return next(CustomErrorHandler.wrongCredentials());
        }

        const access_token = await JwtService.sign({ _id: user._id, role: user.role });
        res.json({ access_token });
        //  
    }
    catch (err) {
        return next(err);
    }

}

module.exports = {
    sendOtp,
    register,
    login,
    verifyOtp
};
