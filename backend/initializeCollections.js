// Script to initialize MongoDB collections
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

// Create a dummy user and admin to ensure collections are created
const initializeCollections = async () => {
  try {
    console.log('Initializing collections...');
    
    // Create a dummy user (this will create the users collection)
    const dummyUser = new User({
      name: 'Dummy User',
      email: 'dummy@example.com',
      password: 'password123',
      role: 'user'
    });
    
    // Create a dummy admin (this will create the admins collection)
    const dummyAdmin = new Admin({
      name: 'Dummy Admin',
      email: 'dummyadmin@example.com',
      password: 'password123',
      phone: '1234567890',
      restaurantName: 'Dummy Restaurant',
      restaurantAddress: '123 Dummy Street',
      age: 30,
      restaurantManagerName: 'Dummy Manager',
      role: 'admin',
      status: 'pending'
    });
    
    // Save both to database (this will create the collections)
    await dummyUser.save();
    await dummyAdmin.save();
    
    console.log('Collections initialized successfully!');
    console.log('Users collection created with dummy user');
    console.log('Admins collection created with dummy admin');
    
    // Clean up - remove the dummy entries
    await User.deleteOne({ email: 'dummy@example.com' });
    await Admin.deleteOne({ email: 'dummyadmin@example.com' });
    
    console.log('Dummy entries removed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing collections:', error);
    process.exit(1);
  }
};

initializeCollections();