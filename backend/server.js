// Load env vars first
require('dotenv').config({ path: './.env' });

// Import dependencies
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const auth = require('./routes/auth');
const menu = require('./routes/menu');
const orders = require('./routes/orders');
const upload = require('./routes/upload');
const wishlist = require('./routes/wishlist');
const chefs = require('./routes/chefs');
const reviews = require('./routes/reviews');
const payments = require('./routes/payments');
const admin = require('./routes/admin');
const companyProfile = require('./routes/companyProfile');
const contact = require('./routes/contact');
const gemini = require('./routes/gemini');

// Debug logging to check if environment variables are loaded
console.log('\nEnvironment variables check:');
console.log('MONGODB_URI loaded:', !!process.env.MONGODB_URI);
console.log('STRIPE_SECRET_KEY loaded:', !!process.env.STRIPE_SECRET_KEY);
console.log('STRIPE_PUBLISHABLE_KEY loaded:', !!process.env.STRIPE_PUBLISHABLE_KEY);

// Connect to database
connectDB();

const app = express();

// Enable CORS with specific configuration for production
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: [
      'https://food-order-easy-frontend.onrender.com',
      'https://food-order-easy-admin.onrender.com',
      'https://food-order-easy.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Authorization']
  }));
} else {
  // Development CORS - more permissive
  app.use(cors({
    origin: [
      'http://localhost:5173',  // Frontend dev server
      'http://localhost:5174',  // Admin panel dev server
      'http://localhost:3000',  // Alternative dev server
      'https://food-order-easy-frontend.onrender.com',
      'https://food-order-easy-admin.onrender.com',
      'https://food-order-easy.onrender.com'
    ],
    credentials: true
  }));
}

// Handle preflight requests for all routes
app.options('*', cors());

// Body parser
app.use(express.json());

// Set static folder
app.use(express.static('public'));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/menu', menu);
app.use('/api/v1/orders', orders);
app.use('/api/v1/upload', upload);
app.use('/api/v1/wishlist', wishlist);
app.use('/api/v1/chefs', chefs);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/payments', payments);
app.use('/api/v1/admin', admin);
app.use('/api/v1/company-profile', companyProfile);
app.use('/api/v1/contact', contact);
app.use('/api/v1/gemini', gemini);

// Error handling middleware
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;
  
  // Log the error for debugging
  console.error('Global error handler:', err);
  
  return res.status(status).json({
    success: false,
    error: {
      message: error.message || 'Server Error'
    }
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`\n✓ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`✓ Local: http://localhost:${PORT}`);
});