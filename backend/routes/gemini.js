const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeFoodImage } = require('../controllers/geminiController');
const { protectAdmin, authorizeAdmin } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');

const router = express.Router();

// Add CORS headers for all gemini routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Configure multer storage for temporary image analysis
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const filename = `temp_analysis_${Date.now()}_${Math.round(Math.random() * 1e9)}${fileExtension}`;
    cb(null, filename);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ErrorResponse(`Only JPEG, JPG and PNG files are allowed. Received: ${file.mimetype}`, 400), false);
  }
};

// Multer upload configuration with 20MB file size limit
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

// Route for analyzing food images using Gemini AI
router.route('/analyze-food')
  .post(
    protectAdmin, 
    authorizeAdmin('admin', 'super-admin'),
    upload.single('image'),
    analyzeFoodImage
  );

module.exports = router;