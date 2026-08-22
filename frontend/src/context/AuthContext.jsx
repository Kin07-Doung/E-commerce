import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const restoreAuth = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(restoreAuth);
  const [loading, setLoading] = useState(false);

  const login = async (email, password, recaptchaToken) => {
    const response = await api.post('/auth/login', { email, password, recaptchaToken });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const register = async (name, email, password, recaptchaToken) => {
    const response = await api.post('/auth/register', { name, email, password, recaptchaToken });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const googleSignIn = async (googleToken) => {
    const response = await api.post('/auth/google', { token: googleToken });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const updateProfile = async (name, email, phone) => {
    const response = await api.put('/user/profile', { name, email, phone });
    const updatedUser = response.data;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  const updatePassword = async (currentPassword, newPassword) => {
    const response = await api.put('/user/password', { currentPassword, newPassword });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleSignIn, updateProfile, updatePassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
