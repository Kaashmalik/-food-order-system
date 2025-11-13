const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    maxlength: [100, 'Role cannot be more than 100 characters']
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio'],
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  image: {
    type: String,
    default: ''
  },
  social: {
    twitter: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    facebook: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    }
  },
  // Add reference to the admin who created this chef
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
    // Not required for creation, will be set by controller
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chef', chefSchema);