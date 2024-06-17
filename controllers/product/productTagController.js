const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { productTagSchema } = require('../../validators/serviceValidator');
const { unlinkFile } = require('../../utils/unlinkFile');
const { ProductTag } = require('../../models');

const addProductTag = async (req, res, next) => {
    const data = {
        tag_name: req.body.tag_name,
        image: req.files && req.files['image'] ? req.files['image'][0].filename : null
    }
    const { error } = productTagSchema.validate(data);
    if (error) {
        if (req.files['image']) {
            if (data.image) {
                await unlinkFile(`uploads/${data.image}`);
            }
        }
        return next(error);
    }
    try {
        const checkData = await ProductTag.findOne({ tag_name: data.tag_name }).exec();
        if (checkData) {
            if (checkData.flagDelete == true) {
                checkData.flagDelete = false;
                const updatedTagData = await checkData.save();
                res.status(200).send({ message: 'data recovered successfully', data: updatedTagData });
            }
            if (req.files['image']) {
                if (data.image) {
                    await unlinkFile(`uploads/${data.image}`);
                }
            }
            return next(CustomErrorHandler.alreadyExist('data already exists'));
        }
        const tag = new ProductTag({
            tag_name: data.tag_name,
            image: data.image
        })
        const result = await tag.save();
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

const productTagList = async (req, res, next) => {
    try {
        const results = await ProductTag.find({flagDelete: false}).select('-createdAt -updatedAt -__v -flagDelete').exec();
        if(results.length == 0) {
            return next(CustomErrorHandler.dataNotExist('no data found'));
        }
        res.status(200).json({data: results});
    }
    catch(err) {
        return next(err);
    }
}

const getSingleTag = async (req, res, next) => {
    try {
        const result = await ProductTag.findOne({_id: req.params.id}).select('-createdAt -updatedAt -__v -flagDelete');
        if(!result) {
            return next(CustomErrorHandler.dataNotExist('data not found'));
        }
        res.status(200).json({data: result});
    }
    catch (err) {
        return next(err);
    }
}

const deleteProductTag = async (req, res, next) => {
    try {
        const existsData = await ProductTag.exists({_id: req.params.id});
        if(!existsData) {
            return next(CustomErrorHandler.dataNotExist('data not exists'));
        }
        await ProductTag.findByIdAndUpdate(req.params.id, { flagDelete : true});
        res.status(200).send({message: 'data deleted successfully'});
    }
    catch(err) {
        return next(err);
    }
}

const updateProductTag = async (req, res, next) => {
    const data = {
        tag_name : req.body.tag_name,
        image: req.files && req.files['image'] ? req.files['image'][0].filename : null
    }
    const { error } = await productTagSchema.validate(data);
    if(error) {
        if (req.files['image']) {
            if (data.image) {
                await unlinkFile(`uploads/${data.image}`);
            }
        }
        return next(error);
    }
    try{
        const result = await ProductTag.findOneAndUpdate({ _id: req.params.id }, {
            tag_name: req.body.tag_name,
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
    addProductTag,
    productTagList,
    getSingleTag,
    deleteProductTag,
    updateProductTag
}