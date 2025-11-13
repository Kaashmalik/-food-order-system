const express = require('express');
const {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyStats
} = require('../controllers/companyProfileController');
const { protectAdmin, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getCompanyProfile)
  .put(protectAdmin, authorizeAdmin('super-admin'), updateCompanyProfile);

router
  .route('/stats')
  .get(getCompanyStats);

module.exports = router;