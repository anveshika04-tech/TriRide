import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 5000,
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
        if (error.code === 'ERR_NETWORK') {
            console.error('Server is not running. Please start the backend server.');
            // You can show a user-friendly message here
            alert('Server is not running. Please try again later.');
        }
        return Promise.reject(error);
    }
);

export default API;
