import API from '../config/api';

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const res = await API.get('/auth/me');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch user profile');
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const res = await API.put('/auth/me', userData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to update profile');
  }
};