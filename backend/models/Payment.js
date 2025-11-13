const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash on Delivery', 'Debit Card', 'Credit Card', 'Stripe']
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'inr'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  // For card payments
  cardDetails: {
    last4: String,
    brand: String,
    expiryMonth: String,
    expiryYear: String,
    cardholderName: String
  },
  // For Stripe payments
  stripePaymentIntentId: {
    type: String
  },
  stripeCustomerId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);