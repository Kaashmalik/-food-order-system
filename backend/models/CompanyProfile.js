const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
  storyImage: {
    type: String,
    default: ''
  },
  storyContent: {
    type: String,
    default: 'Founded in 2024, Food-Order-Easy began with a simple mission: to deliver exceptional culinary experiences to food lovers everywhere.\n\nWhat started as a small kitchen experiment has blossomed into a thriving food delivery service. Our journey began when our founder realized that exceptional food shouldn\'t be confined to restaurant walls.\n\nToday, we partner with over 200 local restaurants and employ 50+ delivery professionals to ensure that every meal reaches you in perfect condition, exactly when you need it.'
  },
  founder: {
    name: {
      type: String,
      default: 'Marco Yansen'
    },
    role: {
      type: String,
      default: 'Founder & CEO'
    },
    image: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: 'With over 15 years of experience in the culinary industry, Marco has been at the forefront of food innovation. His passion for bringing exceptional dining experiences to everyone led to the creation of Food-Order-Easy.'
    }
  },
  stats: {
    restaurants: {
      type: Number,
      default: 200
    },
    deliveryProfessionals: {
      type: Number,
      default: 50
    },
    citiesServed: {
      type: Number,
      default: 15
    },
    yearsOfService: {
      type: Number,
      default: 1
    }
  },
  features: [
    {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes
CompanyProfileSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);