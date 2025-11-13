import axios from 'axios';

// Create an axios instance for admin API
const ADMIN_API = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL || 'https://food-order-easy-backend.onrender.com/api/v1/admin',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create an axios instance for general API (including Gemini)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://food-order-easy-backend.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for ADMIN_API
ADMIN_API.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('adminToken');
    
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

// Add a request interceptor for API
API.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('adminToken');
    
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

// Add a response interceptor for ADMIN_API
ADMIN_API.interceptors.response.use(
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
          localStorage.removeItem('adminToken');
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

// Add a response interceptor for API
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
          localStorage.removeItem('adminToken');
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

// Admin registration
export const registerAdmin = async (adminData) => {
  try {
    const res = await ADMIN_API.post('/register', adminData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to register admin');
  }
};

// Admin login
export const loginAdmin = async (email, password) => {
  try {
    const res = await ADMIN_API.post('/login', { email, password });
    // Save token to localStorage
    if (res.data.token) {
      localStorage.setItem('adminToken', res.data.token);
    }
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to login');
  }
};

// Get current admin
export const getCurrentAdmin = async () => {
  try {
    const res = await ADMIN_API.get('/me');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to get admin data');
  }
};

// Logout admin
export const logoutAdmin = async () => {
  try {
    const res = await ADMIN_API.get('/logout');
    // Remove token from localStorage
    localStorage.removeItem('adminToken');
    return res.data;
  } catch (error) {
    // Even if logout fails, remove token from localStorage
    localStorage.removeItem('adminToken');
    // Don't throw error on logout
    return { success: true };
  }
};

// Update admin details
export const updateAdminDetails = async (adminData) => {
  try {
    const res = await ADMIN_API.put('/updatedetails', adminData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to update admin details');
  }
};

// Update admin password
export const updateAdminPassword = async (passwordData) => {
  try {
    const res = await ADMIN_API.put('/updatepassword', passwordData);
    // Save new token to localStorage
    if (res.data.token) {
      localStorage.setItem('adminToken', res.data.token);
    }
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to update password');
  }
};

// Get all admins (super-admin only)
export const getAllAdmins = async () => {
  try {
    const res = await ADMIN_API.get('/');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to get admins');
  }
};

// Get pending admins (super-admin only)
export const getPendingAdmins = async () => {
  try {
    const res = await ADMIN_API.get('/?status=pending');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to get pending admins');
  }
};

// Update admin status (super-admin only)
export const updateAdminStatus = async (adminId, status) => {
  try {
    const res = await ADMIN_API.put(`/${adminId}/status`, { status });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to update admin status');
  }
};

// Analyze food image with Gemini AI
export const analyzeFoodImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Get token from local storage
    const token = localStorage.getItem('adminToken');
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    };
    
    const res = await API.post('/gemini/analyze-food', formData, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to analyze image with AI');
  }
};

export default ADMIN_API;