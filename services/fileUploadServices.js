const multer = require('multer');
const path = require('path');
const CustomErrorHandler = require('../services/CustomErrorHandler'); // Ensure the correct path to CustomErrorHandler

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new CustomErrorHandler(422, 'Only images are allowed (jpeg, jpg, png)'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 1000000 * 2 }, // 2 MB limit
    fileFilter
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'second_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 }
]); // expecting a single file with the field name 'image'

module.exports = upload;
