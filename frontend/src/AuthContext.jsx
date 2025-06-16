// frontend/src/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null); // <-- Added: store username
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUserId = localStorage.getItem('user_id');
    const storedUsername = localStorage.getItem('username'); // <-- Added: read username from localStorage

    if (token && storedUserId && storedUsername) { // <-- Ensure all exist
      setIsAuthenticated(true);
      setUserId(storedUserId);
      setUsername(storedUsername); // <-- Set username
    } else {
      // If any is missing, clear all auth-related info
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username'); // Clear username
      setIsAuthenticated(false);
      setUserId(null);
      setUsername(null); // Clear username
    }
    setLoading(false);
  }, []);

  // Login function: now receives token, userId, username
  const login = (token, id, name) => { // <-- Updated: receive name
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', id);
    localStorage.setItem('username', name); // <-- Store username
    setIsAuthenticated(true);
    setUserId(id);
    setUsername(name); // <-- Set username
  };

  // Logout function: clear all related info
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username'); // <-- Remove username
    setIsAuthenticated(false);
    setUserId(null);
    setUsername(null); // <-- Clear username
  };

  const authContextValue = {
    isAuthenticated,
    userId,
    username, // <-- Expose username
    loading,
    login,
    logout,
  };

  console.log("AuthProvider: Current isAuthenticated state:", isAuthenticated, "Username:", username, "Loading:", loading);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
