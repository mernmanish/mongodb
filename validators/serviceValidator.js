const Joi = require('joi');

// vendor category schema validation
const vendorCategorySchema = Joi.object({
    category_name: Joi.string().min(3).max(30).required(),
    image: Joi.string().allow(null).optional()
});

// vendor registraion schema validation
const vendorSchema = Joi.object({
    user_id: Joi.string().required(),
    vendor_category_id: Joi.string().required(),
    hub_id: Joi.string().optional(),
    territory_id: Joi.string().optional(),
    vendor_owner: Joi.string().required(),
    outlets_name: Joi.string().required(),
    service_gender: Joi.string().required(),
    address: Joi.string().required(),
    landmark: Joi.string().required(),
    pin_code: Joi.number().required()
});

module.exports = {
    vendorCategorySchema,
    vendorSchema
}