import API from '../config/api';
import axios from 'axios';

// Create an admin axios instance
const ADMIN_API = axios.create({
  baseURL: 'http://localhost:5001/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add admin token to requests
ADMIN_API.interceptors.request.use(
  (config) => {
    // Get admin token from local storage
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

// Get all chefs (public - shows all chefs from all admins)
export const getChefs = async () => {
  try {
    const res = await API.get('/chefs');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch chefs');
  }
};

// Get admin chefs (admin only - shows filtered chefs based on role)
export const getAdminChefs = async () => {
  try {
    const res = await ADMIN_API.get('/chefs/admin');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch chefs');
  }
};

// Get single chef
export const getChefById = async (id) => {
  try {
    const res = await API.get(`/chefs/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch chef');
  }
};

// Create a new chef (admin only)
export const createChef = async (chefData) => {
  try {
    const res = await ADMIN_API.post('/chefs', chefData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to create chef');
  }
};

// Update a chef (admin only)
export const updateChef = async (id, chefData) => {
  try {
    const res = await ADMIN_API.put(`/chefs/${id}`, chefData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to update chef');
  }
};

// Delete a chef (admin only)
export const deleteChef = async (id) => {
  try {
    const res = await ADMIN_API.delete(`/chefs/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to delete chef');
  }
};