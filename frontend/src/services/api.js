import axios from 'axios';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: 'http://localhost:5001',
  timeout: 5000
});

// Add request interceptor to include auth token
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, redirect to login
      console.log('Authentication error, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Create specific auth methods
export const authApi = {
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Create map API methods that don't require authentication
export const mapApi = {
  getCoordinates: (address) => {
    return axios.get(`http://localhost:5001/maps/get-coordinates?address=${encodeURIComponent(address)}`);
  },
  getDistanceTime: (origin, destination) => {
    return axios.get(`http://localhost:5001/maps/get-distance-time?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
  },
  getSuggestions: (input) => {
    return axios.get(`http://localhost:5001/maps/get-suggestions?input=${encodeURIComponent(input)}`);
  }
};

export default api;