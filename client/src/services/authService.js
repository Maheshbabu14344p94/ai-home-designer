import API from './api';

export const registerUser = async (name, email, password, role, phone = '') => {
  try {
    const response = await API.post('/auth/register', {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      phone: phone.trim(),
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    throw new Error(errorMessage);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await API.post('/auth/login', {
      email: email.trim(),
      password,
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

export const googleLoginUser = async (profile) => {
  try {
    const response = await API.post('/auth/google-login', {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      picture: profile.photos[0]?.value,
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Google login failed';
    throw new Error(errorMessage);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.clear();
};

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.clear();
};