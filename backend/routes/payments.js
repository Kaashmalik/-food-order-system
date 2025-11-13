const express = require('express');
const { 
  processStripePayment,
  confirmStripePayment,
  createPaymentRecord,
  getPaymentById,
  getMyPayments
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/stripe').post(protect, processStripePayment);
router.route('/stripe/:id/confirm').put(protect, confirmStripePayment);
router.route('/').post(protect, createPaymentRecord);
router.route('/:id').get(protect, getPaymentById);
router.route('/').get(protect, getMyPayments);

module.exports = router;