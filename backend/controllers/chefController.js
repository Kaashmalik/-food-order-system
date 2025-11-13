const Chef = require('../models/Chef');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all chefs
// @route   GET /api/v1/chefs
// @access  Public
const getChefs = asyncHandler(async (req, res, next) => {
  let query;
  
  // If admin is logged in, filter by admin role
  if (req.admin) {
    // Super-admin sees all chefs
    if (req.admin.role === 'super-admin') {
      query = Chef.find();
    } else {
      // Regular admin only sees their own chefs
      query = Chef.find({ createdBy: req.admin.id });
    }
  } else {
    // For public access, show all chefs
    query = Chef.find();
  }
  
  const chefs = await query;
  
  res.status(200).json({
    success: true,
    count: chefs.length,
    data: chefs
  });
});

// @desc    Get single chef
// @route   GET /api/v1/chefs/:id
// @access  Public
const getChef = asyncHandler(async (req, res, next) => {
  const chef = await Chef.findById(req.params.id);

  if (!chef) {
    return next(
      new ErrorResponse(`Chef not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: chef
  });
});

// @desc    Create new chef
// @route   POST /api/v1/chefs
// @access  Private/Admin
const createChef = asyncHandler(async (req, res, next) => {
  // Add the admin who created this chef
  req.body.createdBy = req.admin.id;
  
  const chef = await Chef.create(req.body);

  res.status(201).json({
    success: true,
    data: chef
  });
});

// @desc    Update chef
// @route   PUT /api/v1/chefs/:id
// @access  Private/Admin
const updateChef = asyncHandler(async (req, res, next) => {
  let chef = await Chef.findById(req.params.id);

  if (!chef) {
    return next(
      new ErrorResponse(`Chef not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Check if admin owns this chef (unless they're a super-admin)
  if (req.admin.role !== 'super-admin' && chef.createdBy.toString() !== req.admin.id) {
    return next(
      new ErrorResponse('Not authorized to update this chef', 401)
    );
  }

  chef = await Chef.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: chef
  });
});

// @desc    Delete chef
// @route   DELETE /api/v1/chefs/:id
// @access  Private/Admin
const deleteChef = asyncHandler(async (req, res, next) => {
  const chef = await Chef.findById(req.params.id);

  if (!chef) {
    return next(
      new ErrorResponse(`Chef not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Check if admin owns this chef (unless they're a super-admin)
  if (req.admin.role !== 'super-admin' && chef.createdBy.toString() !== req.admin.id) {
    return next(
      new ErrorResponse('Not authorized to delete this chef', 401)
    );
  }

  await chef.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getChefs,
  getChef,
  createChef,
  updateChef,
  deleteChef
};