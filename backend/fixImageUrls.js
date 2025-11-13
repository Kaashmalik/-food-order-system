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

const fixImageUrls = async () => {
  await connectDB();
  
  try {
    // Find all menu items with relative image paths
    const menuItems = await MenuItem.find({
      image: { $regex: '^/uploads/' }
    });
    
    console.log(`Found ${menuItems.length} menu items with relative image paths`);
    
    // Update each menu item with full URL
    for (const item of menuItems) {
      const fullUrl = `http://localhost:5002${item.image}`;
      await MenuItem.findByIdAndUpdate(item._id, { image: fullUrl });
      console.log(`Updated ${item.name}: ${item.image} -> ${fullUrl}`);
    }
    
    console.log('All image URLs fixed!');
  } catch (error) {
    console.error('Error fixing image URLs:', error);
  } finally {
    mongoose.connection.close();
  }
};

fixImageUrls();