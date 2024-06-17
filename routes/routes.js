const express = require('express');
const router = express.Router();
const upload = require('../services/fileUploadServices');
const { commonController, productController, vendorCategoryController, vendorController, hubController, territoryController, productCategoryController, productTagController } = require('../controllers');

//vendor controller
router.post('/vendor-registration', vendorController.vendorRegistration);
router.post('/update-profile-image', upload, vendorController.updateProfileImage);
router.post('/assign-hub', vendorController.assignHub);


//Manage Product 
router.get('/all-user', commonController.getAll);
router.post('/add-product', upload, productController.addProduct);
router.get('/all-product', productController.allProduct);

//Manage vendor Category
router.post('/add-vendor-category', upload, vendorCategoryController.addVendorCategory);
router.get('/all-vendor-category', vendorCategoryController.allVendorCategory);
router.delete('/delete-vendor-category/:id', vendorCategoryController.deleteVendorCategory);
router.put('/update-vendor-category/:id', upload, vendorCategoryController.updateVendorCategory);

//Manage Territory
router.post('/territory/add-territory', territoryController.addTerritory);
router.get('/territory/all-territory', territoryController.allTerritory);
router.get('/territory/single-territory/:id', territoryController.singleTerritory);
router.put('/territory/update-territory/:id', territoryController.updateTerritory);
router.delete('/territory/delete-territory/:id', territoryController.deleteTerritory);

//Manage Hub
router.post('/hub/add-hub', hubController.addHub);
router.get('/hub/hub-list', hubController.allHub);
router.get('/hub/single-hub/:id', hubController.singleHub);
router.put('/hub/update-hub/:id', hubController.updateHub);
router.delete('/hub/delete-hub/:id', hubController.deleteHub);
router.post('/territory-wise-hub', hubController.territoryWiseHub);

//manage product category
router.post('/product/add-product-category', upload, productCategoryController.addProductCategory);
router.get('/product/all-product-category', productCategoryController.allProductCategory);
router.get('/product/get-single-product-category/:id', productCategoryController.getSingleProductCategory);
router.delete('/product/delete-product-category/:id', productCategoryController.deleteProductCategory);
router.put('/product/update-product-category/:id', upload, productCategoryController.updateProductCategory);

//manage product tags
router.post('/product/add-product-tag', upload, productTagController.addProductTag);
router.get('/product/product-tag-list', productTagController.productTagList);
router.get('/product/get-single-tag/:id', productTagController.getSingleTag);
router.delete('/product/delete-product-tag/:id', productTagController.deleteProductTag);
router.put('/product/update-product-tag/:id', upload, productTagController.updateProductTag);





module.exports = router;