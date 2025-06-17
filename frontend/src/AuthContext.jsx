// frontend/src/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null); // <-- 新增：存储用户名
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUserId = localStorage.getItem('user_id');
    const storedUsername = localStorage.getItem('username'); // <-- 新增：从 localStorage 读取用户名

    if (token && storedUserId && storedUsername) { // <-- 确保所有都存在
      setIsAuthenticated(true);
      setUserId(storedUserId);
      setUsername(storedUsername); // <-- 设置用户名
    } else {
      // 如果任何一个缺失，就清除所有认证相关信息
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username'); // 清除用户名
      setIsAuthenticated(false);
      setUserId(null);
      setUsername(null); // 清除用户名
    }
    setLoading(false);
  }, []);

  // 登录函数：现在接收 token, userId, username
  const login = (token, id, name) => { // <-- 修正：接收 name
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', id);
    localStorage.setItem('username', name); // <-- 存储用户名
    setIsAuthenticated(true);
    setUserId(id);
    setUsername(name); // <-- 设置用户名
  };

  // 登出函数：清除所有相关信息
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username'); // <-- 移除用户名
    setIsAuthenticated(false);
    setUserId(null);
    setUsername(null); // <-- 清除用户名
  };

  const authContextValue = {
    isAuthenticated,
    userId,
    username, // <-- 暴露 username
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