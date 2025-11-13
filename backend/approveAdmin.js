const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const approveAdmin = async (email) => {
  try {
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      console.log('Admin not found with email:', email);
      process.exit(1);
    }
    
    if (admin.status === 'approved') {
      console.log('Admin is already approved');
      process.exit(0);
    }
    
    admin.status = 'approved';
    await admin.save();
    
    console.log('Admin approved successfully!');
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Status:', admin.status);
    
    process.exit(0);
  } catch (error) {
    console.error('Error approving admin:', error);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Please provide an email address');
  console.log('Usage: node approveAdmin.js admin@example.com');
  process.exit(1);
}

approveAdmin(email);