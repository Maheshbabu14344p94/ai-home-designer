import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['user', 'architect'],
      default: 'user',
    },
    profileImage: String,

    // Forgot password OTP fields
    resetPasswordOtpHash: {
      type: String,
      select: false,
    },
    resetPasswordOtpExpiresAt: {
      type: Date,
      select: false,
    },
    resetPasswordOtpVerified: {
      type: Boolean,
      default: false,
      select: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  if (this.password) {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  }

  return next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcryptjs.compare(enteredPassword, this.password);
};

// Set OTP (store hash only)
userSchema.methods.setResetPasswordOtp = function (otp, ttlMinutes = 10) {
  const otpHash = crypto.createHash('sha256').update(String(otp)).digest('hex');
  this.resetPasswordOtpHash = otpHash;
  this.resetPasswordOtpExpiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  this.resetPasswordOtpVerified = false;
};

// Verify OTP
userSchema.methods.verifyResetPasswordOtp = function (otp) {
  if (!this.resetPasswordOtpHash || !this.resetPasswordOtpExpiresAt) return false;
  if (this.resetPasswordOtpExpiresAt.getTime() < Date.now()) return false;

  const otpHash = crypto.createHash('sha256').update(String(otp)).digest('hex');
  return otpHash === this.resetPasswordOtpHash;
};

// Clear OTP after successful reset
userSchema.methods.clearResetPasswordOtp = function () {
  this.resetPasswordOtpHash = undefined;
  this.resetPasswordOtpExpiresAt = undefined;
  this.resetPasswordOtpVerified = false;
};

export default mongoose.model('User', userSchema);