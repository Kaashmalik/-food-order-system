const Review = require('../models/MenuItem').schema.paths.reviews.options.type;
const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get reviews for a menu item
// @route   GET /api/v1/menu/:menuItemId/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res, next) => {
  console.log('Getting reviews for menu item:', req.params.menuItemId);
  const menuItem = await MenuItem.findById(req.params.menuItemId);

  if (!menuItem) {
    console.log('Menu item not found:', req.params.menuItemId);
    return next(new ErrorResponse(`No menu item with the id of ${req.params.menuItemId}`, 404));
  }

  console.log('Found menu item with reviews:', menuItem.reviews.length);
  res.status(200).json({
    success: true,
    count: menuItem.reviews.length,
    data: menuItem.reviews
  });
});

// @desc    Add review for a menu item
// @route   POST /api/v1/menu/:menuItemId/reviews
// @access  Private
const addReview = asyncHandler(async (req, res, next) => {
  console.log('Adding review for menu item:', req.params.menuItemId);
  console.log('Review data:', req.body);
  console.log('User:', req.user);
  
  // Validate menu item ID
  if (!req.params.menuItemId || req.params.menuItemId === 'undefined') {
    console.log('Invalid menu item ID provided:', req.params.menuItemId);
    return next(new ErrorResponse('Invalid menu item ID', 400));
  }
  
  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.menuItemId)) {
    console.log('Invalid MongoDB ObjectId format:', req.params.menuItemId);
    return next(new ErrorResponse('Invalid menu item ID format', 400));
  }
  
  req.body.menuItem = req.params.menuItemId;
  req.body.user = req.user.id;
  req.body.name = req.user.name;

  const menuItem = await MenuItem.findById(req.params.menuItemId);

  if (!menuItem) {
    console.log('Menu item not found with ID:', req.params.menuItemId);
    return next(new ErrorResponse(`No menu item found with the id of ${req.params.menuItemId}`, 404));
  }

  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: req.body.rating,
    comment: req.body.comment
  };

  menuItem.reviews.push(review);

  // Calculate average rating
  menuItem.numOfReviews = menuItem.reviews.length;
  
  const totalRating = menuItem.reviews.reduce((acc, review) => acc + review.rating, 0);
  menuItem.rating = totalRating / menuItem.reviews.length;

  await menuItem.save();

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/v1/menu/:menuItemId/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res, next) => {
  let menuItem = await MenuItem.findOne({ 'reviews._id': req.params.id });

  if (!menuItem) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
  }

  // Find the review
  const review = menuItem.reviews.id(req.params.id);

  // Check if review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update this review`, 401));
  }

  // Update review fields
  review.rating = req.body.rating || review.rating;
  review.comment = req.body.comment || review.comment;

  // Recalculate average rating
  menuItem.numOfReviews = menuItem.reviews.length;
  
  const totalRating = menuItem.reviews.reduce((acc, review) => acc + review.rating, 0);
  menuItem.rating = totalRating / menuItem.reviews.length;

  await menuItem.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/v1/menu/:menuItemId/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res, next) => {
  let menuItem = await MenuItem.findOne({ 'reviews._id': req.params.id });

  if (!menuItem) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
  }

  // Find the review
  const review = menuItem.reviews.id(req.params.id);

  // Check if review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete this review`, 401));
  }

  // Remove review
  menuItem.reviews.pull(req.params.id);

  // Recalculate average rating
  menuItem.numOfReviews = menuItem.reviews.length;
  
  if (menuItem.reviews.length === 0) {
    menuItem.rating = 0;
  } else {
    const totalRating = menuItem.reviews.reduce((acc, review) => acc + review.rating, 0);
    menuItem.rating = totalRating / menuItem.reviews.length;
  }

  await menuItem.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getReviews,
  addReview,
  updateReview,
  deleteReview
};