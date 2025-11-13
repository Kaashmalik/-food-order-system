const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/:id')
  .delete(protect, removeFromWishlist);

module.exports = router;