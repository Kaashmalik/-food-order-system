import axios from 'axios';

// Create an axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://food-order-easy-backend.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - show error message
          console.error('Access forbidden');
          break;
        case 500:
          // Server error - show error message
          console.error('Server error');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error');
    } else {
      // Other errors
      console.error('Error', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;