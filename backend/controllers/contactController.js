const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new contact message
// @route   POST /api/v1/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res, next) => {
  const { name, email, subject, message, phone } = req.body;

  const contactMessage = await ContactMessage.create({
    name,
    email,
    subject,
    message,
    phone
  });

  res.status(201).json({
    success: true,
    data: contactMessage
  });
});

// @desc    Get all contact messages (admin only)
// @route   GET /api/v1/contact
// @access  Private/Admin
const getContactMessages = asyncHandler(async (req, res, next) => {
  let query;
  
  // Super-admin sees all messages
  if (req.admin.role === 'super-admin') {
    query = ContactMessage.find().sort({ createdAt: -1 });
  } else {
    // Regular admin sees all messages (in a real implementation, you might want to filter by admin)
    query = ContactMessage.find().sort({ createdAt: -1 });
  }
  
  const messages = await query;
  
  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
});

// @desc    Get contact messages for current user
// @route   GET /api/v1/contact/user
// @access  Private/User
const getUserContactMessages = asyncHandler(async (req, res, next) => {
  // Get messages for the current user based on their email
  const messages = await ContactMessage.find({ email: req.user.email }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
});

// @desc    Get single contact message
// @route   GET /api/v1/contact/:id
// @access  Private/Admin
const getContactMessage = asyncHandler(async (req, res, next) => {
  const message = await ContactMessage.findById(req.params.id);
  
  if (!message) {
    return next(new ErrorResponse(`Contact message not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user is authorized to view this message
  if (req.user && message.email !== req.user.email) {
    return next(new ErrorResponse('Not authorized to view this message', 401));
  }
  
  res.status(200).json({
    success: true,
    data: message
  });
});

// @desc    Update contact message status
// @route   PUT /api/v1/contact/:id
// @access  Private/Admin
const updateContactMessage = asyncHandler(async (req, res, next) => {
  let message = await ContactMessage.findById(req.params.id);
  
  if (!message) {
    return next(new ErrorResponse(`Contact message not found with id of ${req.params.id}`, 404));
  }
  
  // Update message status
  message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: message
  });
});

// @desc    Delete contact message
// @route   DELETE /api/v1/contact/:id
// @access  Private/Admin
const deleteContactMessage = asyncHandler(async (req, res, next) => {
  const message = await ContactMessage.findById(req.params.id);
  
  if (!message) {
    return next(new ErrorResponse(`Contact message not found with id of ${req.params.id}`, 404));
  }
  
  await message.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get contact messages stats
// @route   GET /api/v1/contact/stats
// @access  Private/Admin
const getContactStats = asyncHandler(async (req, res, next) => {
  const totalMessages = await ContactMessage.countDocuments();
  const unreadMessages = await ContactMessage.countDocuments({ status: 'unread' });
  const repliedMessages = await ContactMessage.countDocuments({ replied: true });
  
  res.status(200).json({
    success: true,
    data: {
      totalMessages,
      unreadMessages,
      repliedMessages
    }
  });
});

module.exports = {
  createContactMessage,
  getContactMessages,
  getUserContactMessages,
  getContactMessage,
  updateContactMessage,
  deleteContactMessage,
  getContactStats
};