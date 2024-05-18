const express = require('express');
const router = express.Router();
const {serviceController} = require('../controllers');


router.get('/all-user', serviceController.getAll);

module.exports = router;