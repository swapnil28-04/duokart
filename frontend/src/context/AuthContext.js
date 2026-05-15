import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState(localStorage.getItem('mode') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Calling login API...');
      const response = await authAPI.login({ email: email, password: password });
      const data = response.data;
      console.log('Login response:', data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      const msg = (err.response && err.response.data && err.response.data.message) || 'Login failed';
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Calling register API with:', userData);
      const response = await authAPI.register(userData);
      const data = response.data;
      console.log('Register response:', data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Register error:', err);
      setLoading(false);
      const msg = (err.response && err.response.data && err.response.data.message) || 'Registration failed';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setMode(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('mode');
  };

  const selectMode = (selectedMode) => {
    setMode(selectedMode);
    localStorage.setItem('mode', selectedMode);
  };

  return (
    <AuthContext.Provider value={{
      user: user,
      mode: mode,
      loading: loading,
      login: login,
      register: register,
      logout: logout,
      selectMode: selectMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);