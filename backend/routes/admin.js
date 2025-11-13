const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  getAdmin,
  updateDetails,
  updatePassword,
  logout,
  getAdmins,
  updateAdminStatus
} = require('../controllers/adminController');
const { protectAdmin, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Add CORS headers for all admin routes
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

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/logout', protectAdmin, logout);
router.get('/me', protectAdmin, getAdmin);
router.put('/updatedetails', protectAdmin, updateDetails);
router.put('/updatepassword', protectAdmin, updatePassword);
router.get('/', protectAdmin, authorizeAdmin('super-admin'), getAdmins);
router.put('/:id/status', protectAdmin, authorizeAdmin('super-admin'), updateAdminStatus);

module.exports = router;