const Joi = require('joi');

// vendor category schema validation
const vendorCategorySchema = Joi.object({
    category_name: Joi.string().min(3).max(30).required(),
    image: Joi.string().allow(null).optional()
});

// vendor registraion schema validation
const vendorSchema = Joi.object({
    vendor_category_id: Joi.string().required(),
    vendor_owner: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().min(10).max(10).required(),
    outlets_name: Joi.string().required(),
    service_gender: Joi.string().required(),
    address: Joi.string().required(),
    landmark: Joi.string().required(),
    pin_code: Joi.number().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
});

// vendor profile image
const profileImageSchema = Joi.object({
    image: Joi.string().allow(null).optional(),
    second_image: Joi.string().allow(null).optional()
});

//territory schema
const territorySchema = Joi.object({
    territory_name: Joi.string().min(3).max(30).required()
});

//hub Schema
const hubSchema = Joi.object({
    territory_id: Joi.string().required(),
    hub_name: Joi.string().min(3).max(30).required(),
});

//territory wise hub schema
const territoryWiseHubSchema = Joi.object({
    territory_id: Joi.string().required()
});

//assign vendor hub schema
const assignVendorHub = Joi.object({
    territory_id: Joi.string().required(),
    hub_id: Joi.string().required(),
    user_id: Joi.string().required()
});

//product category schema
const productCategorySchema = Joi.object({
    category_name: Joi.string().min(3).max(30).required(),
    image: Joi.string().allow(null).optional()
});

//product tag schema
const productTagSchema = Joi.object({
    tag_name: Joi.string().min(3).max(30).required(),
    image: Joi.string().allow(null).optional()
});


module.exports = {
    vendorCategorySchema,
    vendorSchema,
    profileImageSchema,
    territorySchema,
    hubSchema,
    territoryWiseHubSchema,
    assignVendorHub,
    productCategorySchema,
    productTagSchema
}