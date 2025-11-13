const express = require('express');
const {
  getChefs,
  getChef,
  createChef,
  updateChef,
  deleteChef
} = require('../controllers/chefController');
const { protectAdmin, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getChefs)
  .post(protectAdmin, authorizeAdmin('admin', 'super-admin'), createChef);

// Add a test endpoint that requires admin auth
router.route('/admin')
  .get(protectAdmin, authorizeAdmin('admin', 'super-admin'), getChefs);

router.route('/:id')
  .get(getChef)
  .put(protectAdmin, authorizeAdmin('admin', 'super-admin'), updateChef)
  .delete(protectAdmin, authorizeAdmin('admin', 'super-admin'), deleteChef);

module.exports = router;