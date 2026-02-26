import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const result = await authService.registerUser(name, email, password, role, phone);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const result = await authService.loginUser(email, password);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { id, displayName, email, picture } = req.body;

    if (!id || !displayName || !email) {
      return res.status(400).json({ success: false, message: 'Invalid Google profile data' });
    }

    const result = await authService.googleLogin({
      id,
      displayName,
      emails: [{ value: email }],
      photos: [{ value: picture }],
    });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordSendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const result = await authService.forgotPasswordSendOtp(email);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordVerifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const result = await authService.forgotPasswordVerifyOtp(email, otp);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordReset = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP and new password are required' });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const result = await authService.forgotPasswordReset(email, otp, newPassword);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};