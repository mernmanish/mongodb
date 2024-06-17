const Joi = require('joi');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { vendorSchema, profileImageSchema, assignVendorHub } = require('../../validators/serviceValidator');
const { Vendor } = require('../../models');

const vendorRegistration = async (req, res, next) => {
    const { error } = await vendorSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    try {
        const { vendor_category_id, vendor_owner, outlets_name, email, mobile, service_gender, address, landmark, pin_code, latitude, longitude } = req.body;
        const checkVendor = await Vendor.exists({ mobile: mobile, email: email });
        if (checkVendor) {
            return next(CustomErrorHandler.alreadyExist('This vendor already registred'));
        }
        const vendor = new Vendor({
            user_id: req.user._id,
            vendor_category_id: vendor_category_id,
            vendor_owner: vendor_owner,
            outlets_name: outlets_name,
            email: email,
            mobile: mobile,
            service_gender: service_gender,
            address: address,
            landmark: landmark,
            pin_code: pin_code,
            latitude: latitude,
            longitude: longitude
        });
        const result = await vendor.save();
        if (result) {
            res.status(201).send({ message: 'vendor registraion successfully submited', data: result });
        }
    }
    catch (error) {
        return next(err);
    }
};

const updateProfileImage = async (req, res, next) => {
    const data = {
        image: req.files && req.files['image'] ? req.files['image'][0].filename : null,
        second_image: req.files && req.files['second_image'] ? req.files['second_image'][0].filename : null,
    };
    const { error } = await profileImageSchema.validate(data);
    if (error) {
        if (req.files['image']) {
            if (data.image) {
                await unlinkFile(`uploads/${data.image}`);
            }
        }
        if (req.files['second_image']) {
            if (data.second_image) {
                await unlinkFile(`uploads/${data.second_image}`);
            }
        }
        return next(error);
    }
    try {
        const result = await Vendor.findOneAndUpdate({ user_id: req.user._id }, {
            ...(data.image && { logo: data.image }),
            ...(data.second_image && { thumbnail: data.second_image }),
        }, { new: true });
        if (result) {
            res.status(201).json({ message: 'Profile image updated successfully', data: result });
        }
    }
    catch (err) {
        if (req.files['image']) {
            if (data.image) {
                await unlinkFile(`uploads/${data.image}`);
            }
        }
        if (req.files['second_image']) {
            if (data.second_image) {
                await unlinkFile(`uploads/${data.second_image}`);
            }
        }
        return next(err);
    }
}

const assignHub = async (req, res, next) => {
    const { error } = await assignVendorHub.validate(req.body);
    if (error) {
        return next(error);
    }
    const { territory_id, hub_id, user_id } = req.body;
    try {
        const result = await Vendor.findOneAndUpdate({ user_id: user_id }, {
            territory_id: territory_id,
            hub_id: hub_id
        },
            { new: true });
        if (result) {
            res.status(200).send({ message: 'hub assigned successfully' });
        }
    }
    catch (err) {
        return next(err);
    }
}

module.exports = {
    vendorRegistration,
    updateProfileImage,
    assignHub
}