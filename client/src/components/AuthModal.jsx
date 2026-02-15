import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Phone, Home } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

export default function AuthModal() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(searchParams.get('role') || 'user');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
    });
    setError('');
    setShowPassword(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    } else {
      if (!formData.name.trim()) {
        setError('Name is required');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!formData.password) {
        setError('Password is required');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      if (role === 'architect') {
        if (!formData.phone.trim()) {
          setError('Phone number is required for architects');
          return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
          setError('Phone number must be 10 digits');
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email.trim(), formData.password);
        const userRole = result?.user?.role;
        if (userRole === 'architect') {
          navigate('/architect-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        const result = await register(
          formData.name.trim(),
          formData.email.trim(),
          formData.password,
          role,
          formData.phone.trim()
        );
        if (role === 'architect') {
          navigate('/architect-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setGoogleLoading(true);
        setError('');

        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${codeResponse.access_token}` },
        });

        const userInfo = await response.json();

        const profile = {
          id: userInfo.id,
          displayName: userInfo.name,
          emails: [{ value: userInfo.email }],
          photos: [{ value: userInfo.picture }],
        };

        const result = await googleLogin(profile);
        const userRole = result?.user?.role || 'user';
        if (userRole === 'architect') {
          navigate('/architect-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } catch (err) {
        setError('Google login failed. Please try again.');
        console.error('Google login error:', err);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      setError('Google login failed. Please try again.');
      console.error('Google login error:', error);
      setGoogleLoading(false);
    },
    scope: 'openid email profile',
  });

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
    });
    setError('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex items-center justify-center px-4 py-8">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card with shadow and animation */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/80">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <Home size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">AI Home Designer</h2>
            <p className="text-blue-100 text-sm">Design your dream home with AI</p>
          </div>

          {/* Main content */}
          <div className="px-8 py-8">
            <p className="text-center text-gray-700 font-semibold mb-6">
              {isLogin ? '👋 Welcome Back' : '✨ Create Your Account'}
            </p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3 animate-shake">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {!isLogin && (
              <div className="mb-6 flex gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <label className="flex items-center gap-2 cursor-pointer flex-1 group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${role === 'user' ? 'border-blue-600 bg-blue-100' : 'border-gray-300'}`}>
                    {role === 'user' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                  </div>
                  <input
                    type="radio"
                    value="user"
                    checked={role === 'user'}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden"
                  />
                  <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition">User</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer flex-1 group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${role === 'architect' ? 'border-blue-600 bg-blue-100' : 'border-gray-300'}`}>
                    {role === 'architect' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                  </div>
                  <input
                    type="radio"
                    value="architect"
                    checked={role === 'architect'}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden"
                  />
                  <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition">Architect</span>
                </label>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition hover:border-gray-400"
                    autoComplete="off"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition hover:border-gray-400"
                  autoComplete="off"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition hover:border-gray-400"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {!isLogin && role === 'architect' && (
                <div className="relative group">
                  <Phone className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (10 digits)"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition hover:border-gray-400"
                    autoComplete="off"
                  />
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    📞 This will be visible to users who view your designs
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block animate-spin">⚙️</span> Processing...
                  </span>
                ) : isLogin ? (
                  '🔓 Sign In'
                ) : (
                  '✨ Create Account'
                )}
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-gray-500 text-sm font-medium">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleGoogleLoginSuccess()}
              disabled={googleLoading || loading}
              className="w-full mt-6 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-blue-400 hover:bg-blue-50 transition flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {googleLoading ? (
                <>
                  <span className="inline-block animate-spin">⏳</span> Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#1F2937" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#1F2937" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#1F2937" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#1F2937" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google Sign in
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <p className="text-center text-gray-600 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={handleToggleMode}
                className="text-blue-600 font-semibold ml-2 hover:text-blue-700 hover:underline focus:outline-none transition"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Floating info card */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur rounded-lg shadow-lg border border-white/80 text-center">
          <p className="text-gray-600 text-sm">
            🏠 <span className="font-semibold">AI Home Designer</span> - Transform your design ideas into reality
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}