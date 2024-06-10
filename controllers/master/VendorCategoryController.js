const Joi = require('joi');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { unlinkFile } = require('../../utils/unlinkFile');
const { vendorCategorySchema } = require('../../validators/serviceValidator');
const { VendorCategory } = require('../../models');

const addVendorCategory = async (req, res, next) => {
    const data = {
        category_name: req.body.category_name,
        image: req.files && req.files['image'] ? req.files['image'][0].filename : null,
    };
    const { error } = await vendorCategorySchema.validate(data);
    if (error) {
        if (req.files['image']) {
            if (data.image) {
                await unlinkFile(`uploads/${data.image}`);
            }
        }
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
                return res.json({ message: 'Category added successfully', result });
            }
        } else {
            if (req.files['image']) {
                if (data.image) {
                    await unlinkFile(`uploads/${data.image}`);
                }
            }
            return next(CustomErrorHandler.alreadyExist(`${data.category_name} Already Exists`));
        }
    } catch (err) {
        if (req.files['image']) {
            if (data.image) {
                await unlinkFile(`uploads/${data.image}`);
            }
        }
        return next(err);
    }
};

const updateVendorCategory = async (req, res, next) => {
    const data = {
        category_name: req.body.category_name,
        image: req.files && req.files['image'] ? req.files['image'][0].filename : null,
    };
    const { error } = await vendorCategorySchema.validate(data);
    if (error) {
        if (req.files['image']) {
            if (data.image) {
                await unlinkFile(`uploads/${data.image}`);
            }
        }
        return next(error);
    }
    const { category_name } = req.body;
    try {
        // const { id } = req.params; 
        const result = await VendorCategory.findOneAndUpdate({ _id: req.params.id }, {
            category_name,
            ...(data.image && { image: data.image })
        }, { new: true });
        if (result) {
            res.status(201).json({ message: 'Data updated successfully', data: result });
        }
    }
    catch (err) {
        if (req.files['image']) {
            if (data.image) {
                await unlinkFile(`uploads/${data.image}`);
            }
        }
        return next(err);
    }
};

const allVendorCategory = async (req, res, next) => {
    try {
        const data = await VendorCategory.find({ status: 'active' }).select('-createdAt -updatedAt -__v -deleted').sort({ category_name: 1 }).limit(20);
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
    deleteVendorCategory,
    updateVendorCategory
}