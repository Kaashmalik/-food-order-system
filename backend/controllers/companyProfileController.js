const CompanyProfile = require('../models/CompanyProfile');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get company profile
// @route   GET /api/v1/company-profile
// @access  Public
const getCompanyProfile = asyncHandler(async (req, res, next) => {
  let profile = await CompanyProfile.findOne();
  
  // If no profile exists, create a default one
  if (!profile) {
    profile = await CompanyProfile.create({});
  }
  
  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Update company profile
// @route   PUT /api/v1/company-profile
// @access  Private/Super-Admin
const updateCompanyProfile = asyncHandler(async (req, res, next) => {
  let profile = await CompanyProfile.findOne();
  
  // If no profile exists, create one
  if (!profile) {
    profile = await CompanyProfile.create(req.body);
  } else {
    // Update existing profile
    profile = await CompanyProfile.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true
    });
  }
  
  // Update the updatedAt field
  profile.updatedAt = Date.now();
  await profile.save();
  
  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Get company stats
// @route   GET /api/v1/company-profile/stats
// @access  Public
const getCompanyStats = asyncHandler(async (req, res, next) => {
  const profile = await CompanyProfile.findOne();
  
  if (!profile) {
    return next(new ErrorResponse('Company profile not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: profile.stats
  });
});

module.exports = {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyStats
};