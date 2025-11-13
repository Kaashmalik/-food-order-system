const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const createSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'super-admin' });
    
    if (existingSuperAdmin) {
      console.log('Super admin already exists:');
      console.log('Name:', existingSuperAdmin.name);
      console.log('Email:', existingSuperAdmin.email);
      process.exit(0);
    }
    
    // Create super admin
    const superAdmin = await Admin.create({
      name: 'Super Administrator',
      email: 'superadmin@example.com',
      password: 'superadmin123',
      phone: '1234567890',
      restaurantName: 'Main Restaurant',
      restaurantAddress: '123 Main Street',
      age: 35,
      restaurantManagerName: 'Super Manager',
      role: 'super-admin',
      status: 'approved'
    });
    
    console.log('Super admin created successfully!');
    console.log('Name:', superAdmin.name);
    console.log('Email:', superAdmin.email);
    console.log('Role:', superAdmin.role);
    console.log('Status:', superAdmin.status);
    console.log('\nPlease change the default password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();