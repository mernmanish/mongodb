const Joi = require('joi');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { VendorCategory } = require('../../models');

const addVendorCategory = async (req, res, next) => {
    const data = {
        category_name: req.body.category_name,
        image: req.files['image'] ? req.files['image'][0].filename : 'null',
    };
    const schema = Joi.object({
        category_name: Joi.string().min(3).max(30).required(),
        image: Joi.string().optional()
    });
    const { error } = schema.validate(data);
    if (error) {
        return next(error);
    }
    try {
        const checkCategory = await VendorCategory.findOne({ category_name: data.category_name });
        if (!checkCategory) {
            const category = new VendorCategory({
                category_name: data.category_name,
                image: data.image
            });
            const result = await category.save();
            if (result) {
                res.json({ message: 'category added successfully', result });
            }
        }
        else {
            return next(CustomErrorHandler.alreadyExist(`${data.category_name} Already Exists`));
        }
    }
    catch (err) {
        return next(err);
    }
};

const allVendorCategory = async (req, res, next) => {
    try {
        const data = await VendorCategory.find({ status: 'active' }).select('-createdAt -updatedAt -__v');
        if (data.length > 0) {
            res.status(200).json({ data: data });
        }
        else {
            return next(CustomErrorHandler.dataNotExist('data not found'));
        }
    }
    catch (err) {
        return next(err);
    }
};

const deleteVendorCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const checkCategory = await VendorCategory.findOne({ _id: id });
        if (!checkCategory) {
            return next(CustomErrorHandler.dataNotExist('Vendor category not found'));
        }
        else {
            await VendorCategory.findByIdAndUpdate(id, { deleted: true });
            res.status(200).json({ message: 'vendor category deleted successfully' });
        }
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    addVendorCategory,
    allVendorCategory,
    deleteVendorCategory
}