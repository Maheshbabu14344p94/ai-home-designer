import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
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