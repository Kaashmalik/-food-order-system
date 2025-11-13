const express = require('express');
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { protectAdmin, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getMenuItems)
  .post(protectAdmin, authorizeAdmin('admin', 'super-admin'), createMenuItem);

// Add a test endpoint that requires admin auth
router
  .route('/admin')
  .get(protectAdmin, authorizeAdmin('admin', 'super-admin'), getMenuItems);

router
  .route('/:id')
  .get(getMenuItem)
  .put(protectAdmin, authorizeAdmin('admin', 'super-admin'), updateMenuItem)
  .delete(protectAdmin, authorizeAdmin('admin', 'super-admin'), deleteMenuItem);

module.exports = router;