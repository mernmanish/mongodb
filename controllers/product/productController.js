const Joi = require('joi');
const { Product, ProductMedia } = require('../../models')
const CustomErrorHandler = require('../../services/CustomErrorHandler');

const addProduct = async (req, res, next) => {
    const data = {
        product_name: req.body.product_name,
        price: req.body.price ? req.body.price : 0,
        image: req.files['image'] ? req.files['image'][0].filename : 'null',
    };
    const schema = Joi.object({
        product_name: Joi.string().min(3).max(50).required(),
        price: Joi.number().optional(),
        image: Joi.string().optional(),
        gallery_images: Joi.array().items(Joi.string()).optional()
    });
    const { error } = schema.validate(data);
    if (error) {
        return next(error);
    }
    try {
        const product = new Product({
            product_name: data.product_name,
            price: data.price,
            image: data.image,
        });
        await product.save();
        if (req.files && req.files['gallery_images']) {
            const galleryImages = req.files['gallery_images'].map(gallery => ({
                product_id: product.id,
                image: gallery.filename
            }));

            await ProductMedia.insertMany(galleryImages);
        }
        res.json({ message: 'Product added successfully', product });
    }
    catch (err) {
        return next(err);
    }

}

const allProduct = async (req, res, next) => {
    try{
        const data = await Product.find().select('-createdAt -updatedAt -__v').populate('productMedia');
        res.status(200).json({ data: data });
    }
    catch(err) {
        return next(err);
    }
};

module.exports = {
    addProduct,
    allProduct
}