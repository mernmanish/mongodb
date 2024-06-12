const Joi = require('joi');
const { User } = require("../models");
const CustomErrorHandler = require('../services/CustomErrorHandler')

const getAll = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-__v -createdAt -updatedAt -deleted -password')
            .populate({
                path: 'vendor',
                select: '-__v -createdAt -updatedAt -deleted'
            })
            .exec();
        if (!user) {
            return next(CustomErrorHandler.dataNotExist('user not exists'))
        }
        res.status(200).json({ data: user });
    } catch (err) {
        return next(err);
    }
};



module.exports = {
    getAll
}