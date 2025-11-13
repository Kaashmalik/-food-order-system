const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { uploadPhoto } = require('../controllers/uploadController');
const { protectAdmin, authorizeAdmin } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');

const router = express.Router();

// Add CORS headers for all upload routes
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

// Configure multer storage
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
    const filename = `photo_${Date.now()}_${Math.round(Math.random() * 1e9)}${fileExtension}`;
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

// Upload route using multer
router.route('/')
  .post(
    protectAdmin, 
    authorizeAdmin('admin', 'super-admin'),
    upload.single('image'),
    (req, res, next) => {
      console.log('=== Multer Upload Route ===');
      console.log('Admin authenticated:', req.admin ? req.admin.email : 'No admin');
      console.log('File received:', req.file);
      
      if (!req.file) {
        return next(new ErrorResponse('Please upload a valid image file (JPEG or PNG)', 400));
      }
      
      // Attach file info to request for controller
      req.file = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
      
      // Proceed to controller
      uploadPhoto(req, res, next);
    }
  );

module.exports = router;