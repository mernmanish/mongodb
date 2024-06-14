const express = require('express');
const router = express.Router();
const upload = require('../services/fileUploadServices');
const { commonController, productController, vendorCategoryController, vendorController, hubController, territoryController } = require('../controllers');

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
// router.post('/hub/add-hub', hubController.addHub);
// router.get('/hub/hub-list', hubController.allHub);
// router.get('/hub/single-hub/:id', hubController.singleHub);
// router.put('/hub/update-hub/:id', hubController.updateHub);
// router.delete('/hub/delete-hub/:id', hubController.deleteHub);

//Manage Territory
router.post('/territory/add-territory', territoryController.addTerritory);
router.get('/territory/all-territory', territoryController.allTerritory);
router.get('/territory/single-territory/:id', territoryController.singleTerritory);
router.put('/territory/update-territory/:id', territoryController.updateTerritory);
router.delete('/territory/delete-territory/:id', territoryController.deleteTerritory);

module.exports = router;