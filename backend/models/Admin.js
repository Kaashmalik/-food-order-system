const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [/^[0-9]{10,15}$/, 'Please add a valid phone number']
  },
  restaurantName: {
    type: String,
    required: [true, 'Please add a restaurant name'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot be more than 100 characters']
  },
  restaurantAddress: {
    type: String,
    required: [true, 'Please add a restaurant address'],
    trim: true,
    maxlength: [200, 'Restaurant address cannot be more than 200 characters']
  },
  age: {
    type: Number,
    required: [true, 'Please add an age'],
    min: [18, 'Admin must be at least 18 years old'],
    max: [100, 'Admin must be less than 100 years old']
  },
  restaurantManagerName: {
    type: String,
    required: [true, 'Please add a restaurant manager name'],
    trim: true,
    maxlength: [50, 'Manager name cannot be more than 50 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
adminSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Match user entered password to hashed password in database
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);