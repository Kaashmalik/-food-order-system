const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Initialize Stripe with the secret key from environment variables
let stripe;
let Stripe;

// Function to initialize Stripe
const initializeStripe = () => {
  // Access environment variables directly
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  console.log('STRIPE_SECRET_KEY from direct access:', stripeSecretKey ? 'Key present' : 'Key missing');
  
  if (stripeSecretKey) {
    try {
      if (!Stripe) {
        Stripe = require('stripe');
      }
      stripe = Stripe(stripeSecretKey);
      console.log('Stripe initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Stripe:', error.message);
      return false;
    }
  } else {
    console.log('Stripe secret key not found in environment variables');
    return false;
  }
};

// Log environment variables for debugging
console.log('Environment variables check at module load:');
console.log('STRIPE_SECRET_KEY loaded:', !!process.env.STRIPE_SECRET_KEY);
console.log('STRIPE_PUBLISHABLE_KEY loaded:', !!process.env.STRIPE_PUBLISHABLE_KEY);

// @desc    Process Stripe payment
// @route   POST /api/v1/payments/stripe
// @access  Private
const processStripePayment = asyncHandler(async (req, res, next) => {
  // Check if Stripe is configured, initialize if not
  if (!stripe) {
    const initialized = initializeStripe();
    if (!initialized) {
      console.error('Stripe not initialized');
      return next(new ErrorResponse('Stripe payment processing is not configured. Please check environment variables.', 500));
    }
  }
  
  const { orderId, amount, currency = 'inr' } = req.body;
  
  // Get order
  const order = await Order.findById(orderId).populate('user');
  
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }
  
  try {
    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: order.user.email,
      name: order.user.name
    });
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: currency,
      customer: customer.id,
      metadata: {
        orderId: order._id.toString(),
        userId: order.user._id.toString()
      }
    });
    
    // Create payment record
    const payment = await Payment.create({
      order: order._id,
      user: order.user._id,
      paymentMethod: 'Stripe',
      amount: amount,
      currency: currency,
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: customer.id
    });
    
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return next(new ErrorResponse(`Stripe error: ${error.message}`, 500));
  }
});

// @desc    Confirm Stripe payment
// @route   PUT /api/v1/payments/stripe/:id/confirm
// @access  Private
const confirmStripePayment = asyncHandler(async (req, res, next) => {
  // Check if Stripe is configured
  if (!stripe) {
    return next(new ErrorResponse('Stripe payment processing is not configured', 500));
  }
  
  const { paymentId, paymentIntentId } = req.body;
  
  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Update payment status
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'failed',
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    // If payment succeeded, update order
    if (paymentIntent.status === 'succeeded') {
      await Order.findByIdAndUpdate(payment.order, {
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: paymentIntent.charges.data[0]?.billing_details?.email || ''
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    return next(new ErrorResponse(`Stripe error: ${error.message}`, 500));
  }
});

// @desc    Create payment record for other payment methods
// @route   POST /api/v1/payments
// @access  Private
const createPaymentRecord = asyncHandler(async (req, res, next) => {
  const { orderId, paymentMethod, amount, cardDetails } = req.body;
  
  // Get order
  const order = await Order.findById(orderId);
  
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }
  
  // Create payment record
  const paymentData = {
    order: order._id,
    user: req.user._id,
    paymentMethod: paymentMethod,
    amount: amount,
    status: paymentMethod === 'Cash on Delivery' ? 'pending' : 'completed'
  };
  
  // Add card details if provided
  if (cardDetails) {
    paymentData.cardDetails = {
      last4: cardDetails.last4,
      brand: cardDetails.brand,
      expiryMonth: cardDetails.expiryMonth,
      expiryYear: cardDetails.expiryYear,
      cardholderName: cardDetails.cardholderName
    };
  }
  
  const payment = await Payment.create(paymentData);
  
  // For COD, don't mark order as paid yet
  // For card payments, mark order as paid
  if (paymentMethod !== 'Cash on Delivery') {
    await Order.findByIdAndUpdate(order._id, {
      isPaid: true,
      paidAt: Date.now()
    });
  }
  
  res.status(201).json({
    success: true,
    data: payment
  });
});

// @desc    Get payment by ID
// @route   GET /api/v1/payments/:id
// @access  Private
const getPaymentById = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id).populate('order user');
  
  if (!payment) {
    return next(new ErrorResponse('Payment not found', 404));
  }
  
  // Check if user is authorized to view this payment
  if (payment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view this payment', 403));
  }
  
  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Get user's payments
// @route   GET /api/v1/payments
// @access  Private
const getMyPayments = asyncHandler(async (req, res, next) => {
  const payments = await Payment.find({ user: req.user._id }).populate('order');
  
  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});

module.exports = {
  processStripePayment,
  confirmStripePayment,
  createPaymentRecord,
  getPaymentById,
  getMyPayments
};