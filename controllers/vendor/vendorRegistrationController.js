const Joi = require('joi');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { vendorSchema } = require('../../validators/serviceValidator'); 

const vendorRegistration = async(req, res, next) => {
    const { error } = await vendorSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    try {
        console.log('welcome to vendor registration');
    }
    catch(error) {
        return next(err);
    }
};

module.exports = {
    vendorRegistration
}