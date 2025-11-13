const express = require('express');
const {
  getReviews,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Mount review routes under menu routes
router.route('/reviews').get(getReviews).post(protect, addReview);
router.route('/reviews/:id').put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;