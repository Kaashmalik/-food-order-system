const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    cardDetails,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new ErrorResponse('No order items', 400));
  } else {
    // Validate that all items exist and determine the restaurant
    let restaurantId = null;
    for (const item of orderItems) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return next(new ErrorResponse(`Menu item not found with id ${item.menuItem}`, 404));
      }
      
      // Set restaurant from first item (all items should be from same restaurant)
      if (!restaurantId) {
        restaurantId = menuItem.createdBy;
      } else if (restaurantId.toString() !== menuItem.createdBy.toString()) {
        return next(new ErrorResponse('All items must be from the same restaurant', 400));
      }
      
      // Set item name and price from menu item
      item.name = menuItem.name;
      item.price = menuItem.price;
    }

    const orderData = {
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      restaurant: restaurantId // Set the restaurant/createdBy field
    };

    // Add card details if provided
    if (cardDetails) {
      orderData.cardDetails = cardDetails;
    }

    const order = new Order(orderData);

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate({
      path: 'orderItems.menuItem',
      select: 'name image price'
    });

  if (order) {
    res.json(order);
  } else {
    return next(new ErrorResponse('Order not found', 404));
  }
});

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    return next(new ErrorResponse('Order not found', 404));
  }
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
    .populate({
      path: 'orderItems.menuItem',
      select: 'name image price'
    });
  res.json(orders);
});

// @desc    Get all orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res, next) => {
  let query;
  
  // If admin is logged in, filter by admin role
  if (req.admin) {
    // Super-admin sees all orders
    if (req.admin.role === 'super-admin') {
      query = Order.find().populate('user', 'id name email');
    } else {
      // Regular admin only sees orders for their restaurant
      query = Order.find({ restaurant: req.admin.id }).populate('user', 'id name email');
    }
  } else {
    // For public access (should not happen), show all orders
    query = Order.find({}).populate('user', 'id name email');
  }
  
  // Populate order items with menu item details including image
  query = query.populate({
    path: 'orderItems.menuItem',
    select: 'name image price'
  });
  
  const orders = await query;
  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Check if admin owns this order (unless they're a super-admin)
    if (req.admin.role !== 'super-admin' && order.restaurant.toString() !== req.admin.id) {
      return next(
        new ErrorResponse('Not authorized to update this order', 401)
      );
    }
    
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder
    });
  } else {
    return next(new ErrorResponse('Order not found', 404));
  }
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Check if admin owns this order (unless they're a super-admin)
    if (req.admin.role !== 'super-admin' && order.restaurant.toString() !== req.admin.id) {
      return next(
        new ErrorResponse('Not authorized to update this order', 401)
      );
    }
    
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'In Process', 'Out of Delivery', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return next(new ErrorResponse('Invalid status', 400));
    }
    
    // Update order status
    order.status = status;
    
    // Update related fields based on status
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    } else if (status === 'In Process' || status === 'Out of Delivery') {
      order.isDelivered = false;
      order.deliveredAt = null;
    }
    
    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder
    });
  } else {
    return next(new ErrorResponse('Order not found', 404));
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus
};