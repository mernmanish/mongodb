const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { commonController, productController } = require('../controllers');


router.get('/all-user', commonController.getAll);
router.post('/add-product',upload.single('image'), productController.addProduct);

module.exports = router;