import axios from 'axios';

// Create axios instance with auth interceptor
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  timeout: 5000
});

// Add request interceptor to include auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, redirect to appropriate login page
      console.log('Authentication error, redirecting to login');
      const isCaptain = localStorage.getItem('captain');
      localStorage.removeItem('token');
      localStorage.removeItem('captain');
      window.location.href = isCaptain ? '/captain/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
