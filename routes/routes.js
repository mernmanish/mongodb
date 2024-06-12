const express = require('express');
const router = express.Router();
const upload = require('../services/fileUploadServices');
const { commonController, productController, vendorCategoryController, vendorController, hubController } = require('../controllers');

//vendor controller
router.post('/vendor-registration', vendorController.vendorRegistration);
router.post('/update-profile-image', upload, vendorController.updateProfileImage);


//Manage Product 
router.get('/all-user', commonController.getAll);
router.post('/add-product', upload, productController.addProduct);
router.get('/all-product', productController.allProduct);

//Manage Product Category
router.post('/add-vendor-category', upload, vendorCategoryController.addVendorCategory);
router.get('/all-vendor-category', vendorCategoryController.allVendorCategory);
router.delete('/delete-vendor-category/:id', vendorCategoryController.deleteVendorCategory);
router.put('/update-vendor-category/:id', upload, vendorCategoryController.updateVendorCategory);

//Manage Hub
router.post('/add-hub', upload, hubController.addHub);

module.exports = router;