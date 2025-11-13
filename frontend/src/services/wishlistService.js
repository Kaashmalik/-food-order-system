import API from '../config/api';

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const res = await API.get('/wishlist');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch wishlist');
  }
};

// Add item to wishlist
export const addToWishlist = async (menuItemId) => {
  try {
    const res = await API.post('/wishlist', { menuItemId });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to add item to wishlist');
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (menuItemId) => {
  try {
    const res = await API.delete(`/wishlist/${menuItemId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to remove item from wishlist');
  }
};