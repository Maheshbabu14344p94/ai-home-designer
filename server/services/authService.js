import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (name, email, password, role = 'user', phone = '') => {
  let user = await User.findOne({ email });

  if (user) {
    const error = new Error('User already exists');
    error.status = 400;
    throw error;
  }

  user = new User({ name, email, password, role, phone });
  await user.save();

  const token = generateToken(user._id, user.role);
  return { 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      phone: user.phone,
      role: user.role 
    }, 
    token 
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

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
  return { 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      phone: user.phone,
      role: user.role 
    }, 
    token 
  };
};

export const googleLogin = async (profile) => {
  let user = await User.findOne({ googleId: profile.id });

  if (!user) {
    user = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
      role: 'user',
    });
    await user.save();
  }

  const token = generateToken(user._id, user.role);
  return { 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      phone: user.phone,
      role: user.role 
    }, 
    token 
  };
};