const express = require('express');
const router = express.Router();
const {userController} = require('../controllers');

router.post('/user-registration', userController.register);

module.exports = router;