const Joi = require('joi');
const multer = require('multer');
// const path = require('path');
const { Product } = require('../../models')
const CustomErrorHandler = require('../../services/CustomErrorHandler');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'uploads/'),
//     filename: (req, file, cb) => {
//         const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
//         cb(null, uniqueName);
//     }
// });

// const handleMultipartData = multer({ storage, limits: {fileSize: 1000000 * 2} }).single('image');

const addProduct = async (req, res, next) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Ensure the 'uploads' folder exists
        },
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
            cb(null, uniqueName);
        },
    });
    
    const upload = multer({ storage, limits: { fileSize: 1000000 * 2 } }); // 2 MB limit
        
    console.log('Incoming data:', req.body);
    console.log('Incoming file:', req.file);
    const data = {
        product_name: req.body.product_name,
        price: parseFloat(req.body.price),
        image: req.file ? req.file.filename : 'null', // Get the filename of the uploaded image
    };
    const schema = Joi.object({
        product_name: Joi.string().min(3).max(50).required(),
        price: Joi.number().optional(),
        image: Joi.string().optional()
    });
    const { error } = schema.validate(data);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    console.log(data);
    res.send('Validation passed');
    return;

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    console.log('Validation passed');
    try {
        // handleMultipartData(req, res, (err) => {
        //     if(err){
        //         return next(CustomErrorHandler.serverError(err.message));
        //     }
        //    // console.log(req.body);
        //     // const filePath = req.file.image;

        // });
        console.log(req.body);
        res.send({});
    }
    catch (err) {
        return next(err);
    }
}

module.exports = {
    addProduct
}