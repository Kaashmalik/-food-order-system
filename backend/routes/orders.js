const express = require('express');
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, protectAdmin, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Add CORS headers for all order routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Create order route
router.route('/')
  .post(protect, addOrderItems)
  .get(protectAdmin, authorizeAdmin('admin', 'super-admin'), getOrders);

// Get logged in user's orders
router.route('/myorders')
  .get(protect, getMyOrders);

// Single order routes
router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, updateOrderToPaid);

// Admin update order status routes
router.route('/:id/deliver')
  .put(protectAdmin, authorizeAdmin('admin', 'super-admin'), updateOrderToDelivered);

router.route('/:id/status')
  .put(protectAdmin, authorizeAdmin('admin', 'super-admin'), updateOrderStatus);

module.exports = router;