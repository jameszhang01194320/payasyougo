// frontend/src/api.js (or api/index.js)

import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // **Core change: update baseURL to point to your Django backend API address**
  baseURL: 'http://127.0.0.1:8000/api/', // <-- Make sure this is port 8000 with the /api/ prefix
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically attach the auth token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Retrieve token from localStorage

    if (token) {
      // If token exists, add it to the Authorization header
      config.headers.Authorization = `Token ${token}`; // Note the space after 'Token '
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// (Optional) Add a response interceptor to handle global 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 Unauthorized is received, it means the token may be expired or invalid
      // Clear local token and redirect to login page
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id'); // If you store user_id
      // Since navigate can't be accessed directly here, use a global redirect mechanism
      // For example, handle 401 and redirect in App.jsx or AuthContext
      window.location.href = '/login'; // A blunt but effective redirect method
    }
    return Promise.reject(error);
  }
);

export default api;
