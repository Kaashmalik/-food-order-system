const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

// @desc    Upload photo for menu item
// @route   POST /api/v1/upload
// @access  Private/Admin
const uploadPhoto = asyncHandler(async (req, res, next) => {
  console.log('=== Upload Controller Started ===');
  console.log('Request received at:', new Date().toISOString());
  console.log('Request file:', req.file);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  try {
    // Check if file was processed
    if (!req.file) {
      console.log('No file found in request');
      return next(new ErrorResponse('Please upload a valid image file (JPEG or PNG)', 400));
    }

    console.log('File uploaded successfully:', req.file);
    
    // Check if filename exists
    if (!req.file.filename) {
      console.log('File saved but filename is missing');
      return next(new ErrorResponse('File upload failed - filename missing', 500));
    }

    // Return full URL for the image
    const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log('Generated URL:', fullUrl);

    res.status(200).json({
      success: true,
      data: fullUrl
    });
    
    console.log('=== Upload Controller Completed Successfully ===');
  } catch (error) {
    console.error('Error in upload controller:', error);
    console.error('Error stack:', error.stack);
    // Don't call next() here as it might cause double callback
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: {
          message: 'Upload failed: ' + error.message
        }
      });
    }
  }
});

module.exports = {
  uploadPhoto
};