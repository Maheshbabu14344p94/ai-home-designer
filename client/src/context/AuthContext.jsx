import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password, role, phone = '') => {
    const result = await authService.registerUser(name, email, password, role, phone);
    setUser(result.user);
    return result;
  };

  const login = async (email, password) => {
    const result = await authService.loginUser(email, password);
    setUser(result.user);
    return result;
  };

  const googleLogin = async (profile) => {
    const result = await authService.googleLoginUser(profile);
    setUser(result.user);
    return result;
  };

  const forgotPasswordSendOtp = async (email) => {
    return authService.forgotPasswordSendOtp(email);
  };

  const forgotPasswordVerifyOtp = async (email, otp) => {
    return authService.forgotPasswordVerifyOtp(email, otp);
  };

  const forgotPasswordReset = async (email, otp, newPassword) => {
    return authService.forgotPasswordReset(email, otp, newPassword);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        googleLogin,
        forgotPasswordSendOtp,
        forgotPasswordVerifyOtp,
        forgotPasswordReset,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};