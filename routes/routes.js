const express = require('express');
const router = express.Router();
const upload = require('../services/fileUploadServices');
const { commonController, productController, vendorCategoryController } = require('../controllers');

//Manage Product 
router.get('/all-user', commonController.getAll);
router.post('/add-product', upload, productController.addProduct);
router.get('/all-product', productController.allProduct);

//Manage Product Category
router.post('/add-vendor-category', upload, vendorCategoryController.addVendorCategory);
router.get('/all-vendor-category', vendorCategoryController.allVendorCategory);
router.delete('/delete-vendor-category/:id', vendorCategoryController.deleteVendorCategory);

module.exports = router;