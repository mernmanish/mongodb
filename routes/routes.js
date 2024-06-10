const express = require('express');
const router = express.Router();
const upload = require('../services/fileUploadServices');
const { commonController, productController, vendorCategoryController, vendorRegistrationController } = require('../controllers');

//vendor controller
router.post('/vendor-registration', vendorRegistrationController.vendorRegistration);


//Manage Product 
router.get('/all-user', commonController.getAll);
router.post('/add-product', upload, productController.addProduct);
router.get('/all-product', productController.allProduct);

//Manage Product Category
router.post('/add-vendor-category', upload, vendorCategoryController.addVendorCategory);
router.get('/all-vendor-category', vendorCategoryController.allVendorCategory);
router.delete('/delete-vendor-category/:id', vendorCategoryController.deleteVendorCategory);
router.put('/update-vendor-category/:id', upload, vendorCategoryController.updateVendorCategory);

module.exports = router;