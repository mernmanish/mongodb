const Joi = require('joi');
const { User, RefreshToken } = require("../../models");
const bcrypt = require('bcrypt');
const { REFRESH_SECRET } = require('../../config');
const JwtService = require('../../services/JwtService');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { generateOtp, validateOtp } = require('../../services/userService');
const { otpSchema, verifyOtpSchema, registerSchema, loginSchema, refreshTokenSchema, logOutSchema, vendorSchema } = require('../../validators/userValidator');
//send otp
const sendOtp = async (req, res, next) => {
    const { error } = await otpSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { mobile } = req.body;
    try {
        const user = await User.findOne({ mobile: mobile });
        if (user) {
            return next(CustomErrorHandler.alreadyExist('Mobile No already exists'))
        }
        else {
            const data = await generateOtp(mobile);
            res.send({
                message: 'otp send successfully'
            });
        }
    }
    catch (err) {
        return next(err);
    }
}

//verifyOtp
const verifyOtp = async (req, res, next) => {
    const { error } = await verifyOtpSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { mobile, otp } = req.body;
    try {
        const userOtp = await validateOtp(mobile, otp);
        if (userOtp) {
            res.status(200).send({
                message: 'otp verifed successfully'
            });
        }
        else {
            res.status(401).send({
                message: 'invalid otp'
            })
        }
    }
    catch (err) {
        return next(err);
    }
};

//registred user
const register = async (req, res, next) => {
    const { error } = await registerSchema.validate(req.body);
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
    let refresh_token;
    try {
        const checkUser = await User.exists({ email: email, mobile: mobile });
        if (checkUser) {
            return next(CustomErrorHandler.alreadyExist('This user already registred'));
        }
        const result = await user.save();
        access_token = await JwtService.sign({ _id: user._id });
        refresh_token = await JwtService.sign({ _id: user._id }, '1y', REFRESH_SECRET);

        await RefreshToken.create({ token: refresh_token });
        res.json({ access_token, refresh_token, result });
    } catch (err) {
        return next(err);
    }


};


//login user
const login = async (req, res, next) => {
    const { error } = await loginSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    try {
        const user = await User.findOne({ mobile: req.body.mobile }).select('-createdAt -updatedAt -__v -deleteAt');
        if (!user) {
            return next(CustomErrorHandler.dataNotExist('Mobile No not registred'));
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return next(CustomErrorHandler.wrongCredentials());
        }
        const access_token = await JwtService.sign({ _id: user._id });
        const refresh_token = await JwtService.sign({ _id: user._id }, '1y', REFRESH_SECRET);
        await RefreshToken.create({ token: refresh_token });
        res.json({ access_token, refresh_token, user });
        //  
    }
    catch (err) {
        return next(err);
    }
}

// refresh_token
const refreshToken = async (req, res, next) => {
    const { error } = await refreshTokenSchema.validate(req.body);
    if (error) {
        return next(error);
    }

    let refreshToken;
    try {
        refreshToken = await RefreshToken.findOne({ token: req.body.refresh_token });
        if (!refreshToken) {
            return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
        }

        const { _id } = await JwtService.verify(refreshToken.token, REFRESH_SECRET);
        const userId = _id;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return next(CustomErrorHandler.unAuthorized('No user found'));
        }
        const access_token = await JwtService.sign({ _id: user.id });
        const refresh_token = await JwtService.sign({ _id: user.id }, '1y', REFRESH_SECRET);
        await RefreshToken.create({ token: refresh_token });
        res.json({ access_token, refresh_token });

    }
    catch (err) {
        return next(new Error('something went wrong' + err.message));
    }
};

// user logout
const logOut = async (req, res, next) => {
    const { error } = await logOutSchema.validate(req.body);
    if (error) {
        return next(error);
    }

    try {
        const token = await RefreshToken.deleteOne({ token: req.body.refresh_token });
        if (!token) {
            return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
        }

        res.send({ message: 'user logout successfully' });

    }
    catch (err) {
        return next(err);
    }
};






module.exports = {
    sendOtp,
    verifyOtp,
    register,
    login,
    refreshToken,
    logOut

};
