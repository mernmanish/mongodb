const express = require('express');
const router = express.Router();
const {userController} = require('../controllers');

router.post('/send-otp', userController.sendOtp);
router.post('/verify-otp', userController.verifyOtp);
router.post('/user-registration', userController.register);
router.post('/login', userController.login);

module.exports = router;