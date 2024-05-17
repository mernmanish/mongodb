const { string, required } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserOtpSchema = new Schema({
    mobile: {
        type: String,
        require: true
    },
    otp: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('UserOtp',UserOtpSchema,'user_otp');