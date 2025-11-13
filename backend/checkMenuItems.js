const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const checkMenuItems = async () => {
  await connectDB();
  
  try {
    const menuItems = await MenuItem.find({});
    console.log('Menu Items:');
    console.log(JSON.stringify(menuItems, null, 2));
  } catch (error) {
    console.error('Error fetching menu items:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkMenuItems();