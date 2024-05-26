const express = require('express');
const router = express.Router();
const upload = require('../services/fileUploadServices');
const { commonController, productController } = require('../controllers');


router.get('/all-user', commonController.getAll);
router.post('/add-product',upload, productController.addProduct);
router.get('/all-product', productController.allProduct);

module.exports = router;