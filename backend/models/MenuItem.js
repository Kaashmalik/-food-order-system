const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'appetizer',
      'main-course',
      'dessert',
      'beverage',
      'special'
    ]
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  // Add reference to the admin who created this item
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

module.exports = mongoose.model('MenuItem', menuItemSchema);