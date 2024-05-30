const Joi = require('joi');
const { Product, ProductMedia } = require('../../models')
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { unlinkFile } = require('../../utils/unlinkFile');

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
        if (data.image) {
            unlinkFile(`uploads/${data.image}`, next);
        }
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
        if (data.image) {
            unlinkFile(`uploads/${data.image}`, next);
        }
        return next(err);
    }

}

const allProduct = async (req, res, next) => {
    try {
        const products = await Product.find().exec();
        for (let product of products) {
            const productMedia = await ProductMedia.find({ product_id: product._id }).exec();
            product.productMedia = productMedia.map(media => ({
                _id: media._id,
                product_id : media.product_id,
                image: media.image
            }));
        }
        const result = products.map(product => ({
            _id: product._id,
            product_name: product.product_name,
            price: product.price,
            gender: product.gender,
            description: product.description,
            image: product.image,
            status: product.status,
            productMedia: product.productMedia,
        }));
        res.status(200).json({ data: result });
    } catch (err) {
        return next(err);
    }
};







module.exports = {
    addProduct,
    allProduct
}