import API from '../config/api';

// Create a new contact message
export const createContactMessage = async (contactData) => {
  try {
    const res = await API.post('/contact', contactData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to send message');
  }
};

// Get user's contact messages
export const getUserMessages = async () => {
  try {
    const res = await API.get('/contact/user');
    console.log('User messages response:', res.data); // Debug log
    return res.data;
  } catch (error) {
    console.error('Error fetching user messages:', error); // Debug log
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch messages');
  }
};

export default {
  createContactMessage,
  getUserMessages
};