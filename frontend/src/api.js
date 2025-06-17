// frontend/src/api.js (或 api/index.js)

import axios from 'axios';

// 创建一个 Axios 实例
const api = axios.create({
  // **核心修改：更改 baseURL 以指向你的 Django 后端 API 地址**
  baseURL: 'http://127.0.0.1:8000/api/', // <-- 确保这里是 8000 端口，且有 /api/ 前缀
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器，用于在每个请求中自动附加认证 Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // 从 localStorage 获取 Token

    if (token) {
      // 如果 Token 存在，将其添加到 Authorization 头中
      config.headers.Authorization = `Token ${token}`; // 注意 'Token ' 后面有一个空格
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// （可选）添加响应拦截器，用于处理全局的 401 Unauthorized 错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 如果收到 401 Unauthorized，意味着 Token 可能过期或无效
      // 清除本地 Token 并重定向到登录页面
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id'); // 如果你存储了 user_id
      // 由于这里不能直接访问 navigate，你可能需要一个全局的重定向机制
      // 例如，在 App.jsx 或 AuthContext 中处理 401 错误并重定向
      window.location.href = '/login'; // 粗暴但有效的重定向方式
    }
    return Promise.reject(error);
  }
);

export default api;