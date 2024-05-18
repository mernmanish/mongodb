const Joi = require('joi');
const { User } = require("../models");
const CustomErrorHandler = require('../services/CustomErrorHandler');


const getAll = async (req, res, next) => {
    try {
        const user = await User.find().select('-password -createdAt -updatedAt -__v -deleteAt');
        res.status(200).json({data: user});
    } catch (err) {
        return next(err);
    }
};


module.exports = {
    getAll
}