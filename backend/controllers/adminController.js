const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');

// @desc    Register admin
// @route   POST /api/v1/admin/register
// @access  Public
const registerAdmin = asyncHandler(async (req, res, next) => {
  const { 
    name, 
    email, 
    password, 
    phone, 
    restaurantName, 
    restaurantAddress, 
    age, 
    restaurantManagerName 
  } = req.body;

  // Check if admin already exists
  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    return next(new ErrorResponse('Admin already exists with this email', 400));
  }

  // Create admin
  const admin = await Admin.create({
    name,
    email,
    password,
    phone,
    restaurantName,
    restaurantAddress,
    age,
    restaurantManagerName,
    role: 'admin', // Default role is admin, super-admin can be set manually
    status: 'pending' // Default status is pending approval
  });

  // Send token response
  sendTokenResponse(admin, 201, res);
});

// @desc    Login admin
// @route   POST /api/v1/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for admin
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Super-admins can login regardless of status
  // Normal admins must be approved
  if (admin.role !== 'super-admin' && admin.status !== 'approved') {
    return next(new ErrorResponse('Account not approved yet. Please contact super-admin.', 401));
  }

  // Send token response
  sendTokenResponse(admin, 200, res);
});

// @desc    Get current admin
// @route   GET /api/v1/admin/me
// @access  Private
const getAdmin = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);

  res.status(200).json({
    success: true,
    data: admin
  });
});

// @desc    Update admin details
// @route   PUT /api/v1/admin/updatedetails
// @access  Private
const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    restaurantName: req.body.restaurantName,
    restaurantAddress: req.body.restaurantAddress,
    age: req.body.age,
    restaurantManagerName: req.body.restaurantManagerName
  };

  const admin = await Admin.findByIdAndUpdate(req.admin.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: admin
  });
});

// @desc    Update admin password
// @route   PUT /api/v1/admin/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id).select('+password');

  // Check current password
  if (!(await admin.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  admin.password = req.body.newPassword;
  await admin.save();

  sendTokenResponse(admin, 200, res);
});

// @desc    Logout admin
// @route   GET /api/v1/admin/logout
// @access  Private
const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get all admins (for super-admin)
// @route   GET /api/v1/admin
// @access  Private/Super-Admin
const getAdmins = asyncHandler(async (req, res, next) => {
  // Only super-admins can get all admins
  if (req.admin.role !== 'super-admin') {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  // Build query
  const query = {};
  
  // Filter by status if provided
  if (req.query.status) {
    query.status = req.query.status;
  }

  const admins = await Admin.find(query);

  res.status(200).json({
    success: true,
    count: admins.length,
    data: admins
  });
});

// @desc    Update admin status (approve/reject)
// @route   PUT /api/v1/admin/:id/status
// @access  Private/Super-Admin
const updateAdminStatus = asyncHandler(async (req, res, next) => {
  // Only super-admins can update admin status
  if (req.admin.role !== 'super-admin') {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  const admin = await Admin.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      new: true,
      runValidators: true
    }
  );

  if (!admin) {
    return next(new ErrorResponse(`Admin not found with id of ${req.params.id}`, 404));
  }

  // Send email notification to admin about status change
  try {
    await sendEmail({
      email: admin.email,
      subject: `Admin Account ${req.body.status}`,
      message: `Your admin account has been ${req.body.status}. You can now ${req.body.status === 'approved' ? 'login' : 'contact super-admin for more information'}.`
    });
  } catch (err) {
    console.log('Email could not be sent', err);
  }

  res.status(200).json({
    success: true,
    data: admin
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
  // Create token
  const token = admin.getSignedJwtToken();

  // Use environment variable or default to 30 days
  const cookieExpireDays = process.env.JWT_COOKIE_EXPIRE || 30;

  const options = {
    expires: new Date(
      Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status
      }
    });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdmin,
  updateDetails,
  updatePassword,
  logout,
  getAdmins,
  updateAdminStatus
};