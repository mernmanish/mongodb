const express = require('express');
const router = express.Router();
const upload = require('../services/fileUploadServices');
const passport = require('passport');
const { userController } = require('../controllers');
passport.initialize();

//user routes
router.post('/send-otp', userController.sendOtp);
router.post('/verify-otp', userController.verifyOtp);
router.post('/user-registration', userController.register);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);
router.post('/logout', passport.authenticate('jwt', { session: false }), userController.logOut);




module.exports = router;