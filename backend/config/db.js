const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    console.log('Connection string (masked):', process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 75000,
      family: 4, // Force IPv4
      directConnection: false, // Let driver handle routing
      retryWrites: true,
      w: 'majority',
      // Additional DNS resolution options
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.name}`);
    
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error after initial connection:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });
    
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    
    // More detailed error info
    if (error.reason && error.reason.servers) {
      console.error('\nServer connection attempts:');
      error.reason.servers.forEach((server, address) => {
        console.error(`  ${address}:`, server.error?.message || 'Unknown error');
      });
    }
    
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Change Windows DNS to 8.8.8.8 and 8.8.4.4');
    console.error('2. Run: ipconfig /flushdns (in Command Prompt as Admin)');
    console.error('3. Try using Cloudflare WARP VPN');
    console.error('4. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)');
    console.error('5. Test connection: ping cluster0-shard-00-00.ptclunw.mongodb.net');
    
    process.exit(1);
  }
};

module.exports = connectDB;