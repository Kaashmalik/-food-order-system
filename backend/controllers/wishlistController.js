const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

// @desc    Get user's wishlist
// @route   GET /api/v1/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('wishlist');
  
  res.status(200).json({
    success: true,
    count: user.wishlist.length,
    data: user.wishlist
  });
});

// @desc    Add item to wishlist
// @route   POST /api/v1/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res, next) => {
  const { menuItemId } = req.body;
  
  // Check if menu item exists
  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    return next(new ErrorResponse('Menu item not found', 404));
  }
  
  // Add item to wishlist if not already there
  const user = await User.findById(req.user.id);
  if (!user.wishlist.includes(menuItemId)) {
    user.wishlist.push(menuItemId);
    await user.save();
  }
  
  // Populate the wishlist with menu item details
  await user.populate('wishlist');
  
  res.status(200).json({
    success: true,
    count: user.wishlist.length,
    data: user.wishlist
  });
});

// @desc    Remove item from wishlist
// @route   DELETE /api/v1/wishlist/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  // Remove item from wishlist
  user.wishlist = user.wishlist.filter(
    item => item.toString() !== req.params.id
  );
  
  await user.save();
  
  // Populate the wishlist with menu item details
  await user.populate('wishlist');
  
  res.status(200).json({
    success: true,
    count: user.wishlist.length,
    data: user.wishlist
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};