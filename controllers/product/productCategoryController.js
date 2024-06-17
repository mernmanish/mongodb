const { productCategorySchema } = require('../../validators/serviceValidator');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { unlinkFile } = require('../../utils/unlinkFile');
const { ProductCategory } = require('../../models');

const addProductCategory = async (req, res, next) => {
    const data = {
        category_name: req.body.category_name,
        image: req.files && req.files['image'] ? req.files['image'][0].filename : null,
    };
    const { error } = await productCategorySchema.validate(req.body);
    if (error) {
        if (req.files['image']) {
            if (data.image) {
                await unlinkFile(`uploads/${data.image}`);
            }
        }
        return next(error);
    }
    try {
        const checkCategory = await ProductCategory.findOne({category_name: data.category_name}).exec();
        if(checkCategory) {
            if(checkCategory.flagDelete == true) {
                checkCategory.flagDelete = false;
                const updatedCategoryData = await checkCategory.save();
                return res.status(200).send({message: 'data recovered successfully', data: updatedCategoryData});
            }
            if (req.files['image']) {
                if (data.image) {
                    await unlinkFile(`uploads/${data.image}`);
                }
            }
            return next(CustomErrorHandler.alreadyExist('category already added'));
        }

        const category = new ProductCategory({
            category_name: data.category_name,
            image: data.image
        });
        const result = await category.save();
        res.status(200).send({message: 'data added successfully', data: result});

    }
    catch (err) {
        if (req.files['image']) {
            if (data.image) {
                await unlinkFile(`uploads/${data.image}`);
            }
        }
        return next(err);
    }
}

const allProductCategory = async (req, res, next) => {
    try {
        const results = await ProductCategory.find({flagDelete : false}).select('-createdAt -updatedAt -__v -flagDelete');
        if(results.length == 0) {
            return next(CustomErrorHandler.dataNotExist('no data found'));
        }
        res.status(200).send({data: results});
    }
    catch(err) {
        return next(err);
    }
}

const getSingleProductCategory = async (req, res, next) => {
    try {
        const result = await ProductCategory.findOne({_id: req.params.id, flagDelete: false }).select('-createdAt -updatedAt -__v -flagDelete');
        if(!result) {
            return next(CustomErrorHandler.dataNotExist('data not found'));
        }
        res.status(200).json({data: result});
    }
    catch(err) {
        return next(err);
    }
}

const deleteProductCategory = async (req, res, next) => {
    try {
        const checkCategory = await ProductCategory.exists({_id: req.params.id});
        if(!checkCategory) {
            return next(CustomErrorHandler.dataNotExist('no data exists'));
        }
        const result = await ProductCategory.findByIdAndUpdate(req.params.id, { flagDelete: true });
        res.status(200).send({message: 'category deleted successfully'});
    }
    catch(err) {
        return next(err);
    }
}

const updateProductCategory = async (req, res, next) => {
    const data = {
        category_name : req.body.category_name,
        image: req.files && req.files['image'] ? req.files['image'][0].filename : null
    }
    const { error } = await productCategorySchema.validate(data);
    if(error) {
        if (req.files['image']) {
            if (data.image) {
                await unlinkFile(`uploads/${data.image}`);
            }
        }
        return next(error);
    }
    try{
        const result = await ProductCategory.findOneAndUpdate({ _id: req.params.id }, {
            category_name: req.body.category_name,
            ...(data.image && { image: data.image })
        }, { new: true });
        if (result) {
            res.status(201).json({ message: 'Data updated successfully', data: result });
        }
    }
    catch(err) {
        return next(err);
    }
}

module.exports = {
    addProductCategory,
    allProductCategory,
    getSingleProductCategory,
    deleteProductCategory,
    updateProductCategory
}