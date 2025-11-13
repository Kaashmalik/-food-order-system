import API from '../config/api';

// Get all menu items
export const getMenuItems = async () => {
  try {
    console.log('Fetching all menu items...');
    const res = await API.get('/menu');
    console.log('Menu items response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch menu items');
  }
};

// Get menu item by ID
export const getMenuItemById = async (id) => {
  try {
    console.log('Fetching menu item with ID:', id);
    
    // Validate ID before making API call
    if (!id || id === 'undefined') {
      throw new Error('Invalid menu item ID');
    }
    
    const res = await API.get(`/menu/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch menu item');
  }
};

// Get top rated menu items
export const getTopRatedItems = async () => {
  try {
    console.log('Fetching top rated items...');
    const res = await API.get('/menu?sort=-rating&limit=10');
    console.log('Top rated items response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch top rated items:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch top rated items');
  }
};

// Search menu items
export const searchMenuItems = async (query) => {
  try {
    const res = await API.get(`/menu?search=${query}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to search menu items');
  }
};

// Search menu items by multiple criteria
export const searchMenuItemsAdvanced = async (query, category = null) => {
  try {
    let url = `/menu?search=${query}`;
    if (category && category !== 'all') {
      url += `&category=${category}`;
    }
    const res = await API.get(url);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to search menu items');
  }
};

// Get menu items for autocomplete (limited fields for performance)
export const getMenuItemsForAutocomplete = async (query) => {
  try {
    const res = await API.get(`/menu?search=${query}&select=name,price,image,_id`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch autocomplete suggestions');
  }
};