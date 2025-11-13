import API from '../config/api';

// Get reviews for a menu item
export const getReviews = async (menuItemId) => {
  try {
    console.log('Fetching reviews for menu item:', menuItemId);
    // Use the correct endpoint: /api/v1/menu/:menuItemId/reviews
    const res = await API.get(`/menu/${menuItemId}/reviews`);
    console.log('Reviews fetched successfully for', menuItemId, ':', res.data);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch reviews for', menuItemId, ':', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch reviews');
  }
};

// Add review for a menu item
export const addReview = async (menuItemId, reviewData) => {
  try {
    console.log('Adding review for menu item:', menuItemId, reviewData);
    // Use the correct endpoint: /api/v1/menu/:menuItemId/reviews
    const res = await API.post(`/menu/${menuItemId}/reviews`, reviewData);
    console.log('Review added successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('Failed to add review:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to add review');
  }
};

// Update review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const res = await API.put(`/reviews/${reviewId}`, reviewData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to update review');
  }
};

// Delete review
export const deleteReview = async (reviewId) => {
  try {
    const res = await API.delete(`/reviews/${reviewId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to delete review');
  }
};