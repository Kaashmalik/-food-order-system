const MenuItem = require('../models/MenuItem');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all menu items
// @route   GET /api/v1/menu
// @access  Public
const getMenuItems = asyncHandler(async (req, res, next) => {
  let query;
  
  // If admin is logged in, filter by admin role
  if (req.admin) {
    // Super-admin sees all items
    if (req.admin.role === 'super-admin') {
      query = MenuItem.find();
    } else {
      // Regular admin only sees their own items
      query = MenuItem.find({ createdBy: req.admin.id });
    }
  } else {
    // For public access, show all items
    query = MenuItem.find();
  }
  
  const menuItems = await query;
  
  res.status(200).json({
    success: true,
    count: menuItems.length,
    data: menuItems
  });
});

// @desc    Get single menu item
// @route   GET /api/v1/menu/:id
// @access  Public
const getMenuItem = asyncHandler(async (req, res, next) => {
  // Validate ID format
  if (!req.params.id || req.params.id === 'undefined') {
    return next(
      new ErrorResponse('Invalid menu item ID', 400)
    );
  }

  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    return next(
      new ErrorResponse(`MenuItem not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: menuItem
  });
});

// @desc    Create new menu item
// @route   POST /api/v1/menu
// @access  Private/Admin
const createMenuItem = asyncHandler(async (req, res, next) => {
  try {
    // Add the admin who created this item
    req.body.createdBy = req.admin.id;
    
    // Validate that createdBy is set
    if (!req.body.createdBy) {
      return next(new ErrorResponse('Admin ID is required to create menu item', 400));
    }
    
    console.log('Creating menu item with data:', req.body);
    
    const menuItem = await MenuItem.create(req.body);
    
    console.log('Menu item created successfully:', menuItem);

    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return next(new ErrorResponse('Failed to create menu item: ' + error.message, 500));
  }
});

// @desc    Update menu item
// @route   PUT /api/v1/menu/:id
// @access  Private/Admin
const updateMenuItem = asyncHandler(async (req, res, next) => {
  let menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    return next(
      new ErrorResponse(`MenuItem not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Check if admin owns this item (unless they're a super-admin)
  if (req.admin.role !== 'super-admin' && menuItem.createdBy.toString() !== req.admin.id) {
    return next(
      new ErrorResponse('Not authorized to update this item', 401)
    );
  }

  menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: menuItem
  });
});

// @desc    Delete menu item
// @route   DELETE /api/v1/menu/:id
// @access  Private/Admin
const deleteMenuItem = asyncHandler(async (req, res, next) => {
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    return next(
      new ErrorResponse(`MenuItem not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Check if admin owns this item (unless they're a super-admin)
  if (req.admin.role !== 'super-admin' && menuItem.createdBy.toString() !== req.admin.id) {
    return next(
      new ErrorResponse('Not authorized to delete this item', 401)
    );
  }

  await menuItem.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};