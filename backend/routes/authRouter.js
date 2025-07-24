const express = require('express');
const router = express.Router();
const { login, register, logout, verifyEmail, sendOtp, isAuthenticated, sendResetOtp, resetPassword } = require('../controllers/auth/authController');
const UserAuth = require('../middleware/userAuth');

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/send-verify-otp', UserAuth, sendOtp);
router.post('/verify-account', UserAuth, verifyEmail);
router.get('/is-auth', UserAuth, isAuthenticated);
router.post('/send-reset-otp', UserAuth, sendResetOtp); 
router.post('/reset-password', UserAuth, resetPassword);

module.exports = router;
