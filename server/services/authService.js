import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000)); // 6 digits

const sendOtpEmail = async (email, otp) => {
  // Replace with your real mail provider integration
  // For now: logs OTP so you can test quickly in local/dev.
  console.log(`[FORGOT_PASSWORD_OTP] email=${email} otp=${otp}`);
};

export const registerUser = async (name, email, password, role = 'user', phone = '') => {
  let user = await User.findOne({ email: email.toLowerCase().trim() });

  if (user) {
    const error = new Error('User already exists');
    error.status = 400;
    throw error;
  }

  user = new User({
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    password,
    role,
    phone: String(phone || '').trim(),
  });

  await user.save();

  const token = generateToken(user._id, user.role);
  return { user: sanitizeUser(user), token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const token = generateToken(user._id, user.role);
  return { user: sanitizeUser(user), token };
};

export const googleLogin = async (profile) => {
  const email = profile.emails?.[0]?.value?.toLowerCase?.().trim?.();
  if (!email) {
    const error = new Error('Invalid Google profile data');
    error.status = 400;
    throw error;
  }

  // Try by googleId first, then by email (account linking)
  let user = await User.findOne({ googleId: profile.id });
  if (!user) user = await User.findOne({ email });

  if (!user) {
    user = new User({
      name: profile.displayName,
      email,
      googleId: profile.id,
      role: 'user',
      profileImage: profile.photos?.[0]?.value,
    });
  } else if (!user.googleId) {
    user.googleId = profile.id;
    if (!user.profileImage && profile.photos?.[0]?.value) {
      user.profileImage = profile.photos[0].value;
    }
  }

  await user.save();

  const token = generateToken(user._id, user.role);
  return { user: sanitizeUser(user), token };
};

export const forgotPasswordSendOtp = async (email) => {
  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+resetPasswordOtpHash +resetPasswordOtpExpiresAt +resetPasswordOtpVerified'
  );

  // Do not reveal if user exists (prevents email enumeration)
  if (!user) {
    return { message: 'If the email is registered, an OTP has been sent' };
  }

  const otp = generateOtp();
  user.setResetPasswordOtp(otp, 10); // valid for 10 minutes
  await user.save();

  await sendOtpEmail(normalizedEmail, otp);

  return { message: 'If the email is registered, an OTP has been sent' };
};

export const forgotPasswordVerifyOtp = async (email, otp) => {
  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+resetPasswordOtpHash +resetPasswordOtpExpiresAt +resetPasswordOtpVerified'
  );

  if (!user) {
    const error = new Error('Invalid or expired OTP');
    error.status = 400;
    throw error;
  }

  const isValid = user.verifyResetPasswordOtp(String(otp).trim());
  if (!isValid) {
    const error = new Error('Invalid or expired OTP');
    error.status = 400;
    throw error;
  }

  user.resetPasswordOtpVerified = true;
  await user.save();

  return { message: 'OTP verified' };
};

export const forgotPasswordReset = async (email, otp, newPassword) => {
  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+password +resetPasswordOtpHash +resetPasswordOtpExpiresAt +resetPasswordOtpVerified'
  );

  if (!user) {
    const error = new Error('Invalid reset request');
    error.status = 400;
    throw error;
  }

  const isOtpValid = user.verifyResetPasswordOtp(String(otp).trim());
  if (!isOtpValid || !user.resetPasswordOtpVerified) {
    const error = new Error('Invalid or expired OTP');
    error.status = 400;
    throw error;
  }

  if (String(newPassword).length < 8) {
    const error = new Error('Password must be at least 8 characters');
    error.status = 400;
    throw error;
  }

  user.password = newPassword;
  user.clearResetPasswordOtp();
  await user.save();

  return { message: 'Password reset successful' };
};