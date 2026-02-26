import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);

// Forgot password (OTP via email)
router.post('/forgot-password/send-otp', authController.forgotPasswordSendOtp);
router.post('/forgot-password/verify-otp', authController.forgotPasswordVerifyOtp);
router.post('/forgot-password/reset', authController.forgotPasswordReset);

export default router;