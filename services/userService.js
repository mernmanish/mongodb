const { UserOtp } = require('../models');

const generateOtp = async (mobile) => {
    const otp = '123456';
    const user = await UserOtp.findOne({ mobile: mobile });
    if (!user) {
        const data = await UserOtp.create({ mobile: mobile, otp: otp });
        return data;
    }
    else {
        const data = await UserOtp.updateOne({mobile: mobile},{otp: otp});
        return data;
    }
};

const validateOtp = async (mobile, otp) => {
    const data =  await UserOtp.findOne({ mobile: mobile, otp: otp});
    return data;
};


module.exports = {
    generateOtp,
    validateOtp
}