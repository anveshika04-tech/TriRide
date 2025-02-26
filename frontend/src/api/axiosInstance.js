import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000', // Use environment variable
    withCredentials: true, // If using cookies or authentication
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add request interceptor
API.interceptors.request.use(
    config => {
        // Get token from localStorage if it exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor
API.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default API;
