import API from '../config/api';

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const res = await API.post('/orders', orderData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to create order');
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    const res = await API.get(`/orders/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch order');
  }
};

// Update order to paid
export const updateOrderToPaid = async (id, paymentResult) => {
  try {
    const res = await API.put(`/orders/${id}/pay`, paymentResult);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to update order payment');
  }
};

// Get logged in user orders
export const getMyOrders = async () => {
  try {
    const res = await API.get('/orders/myorders');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch orders');
  }
};

// Get all orders (admin only)
export const getOrders = async () => {
  try {
    const res = await API.get('/orders');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch orders');
  }
};

// Update order to delivered (admin only)
export const updateOrderToDelivered = async (id) => {
  try {
    const res = await API.put(`/orders/${id}/deliver`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to update order delivery status');
  }
};

// Create payment record
export const createPayment = async (paymentData) => {
  try {
    const res = await API.post('/payments', paymentData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to create payment');
  }
};

// Process Stripe payment
export const processStripePayment = async (paymentData) => {
  try {
    const res = await API.post('/payments/stripe', paymentData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to process Stripe payment');
  }
};