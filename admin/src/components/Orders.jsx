import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTruck, FaCheck, FaClock, FaBox, FaUser, FaCalendar, FaRupeeSign, FaInfoCircle } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.get('http://localhost:5001/api/v1/orders', config);
      setOrders(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load orders');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Update order status using the new endpoint
      const res = await axios.put(`http://localhost:5001/api/v1/orders/${orderId}/status`, { status }, config);
      const updatedOrder = res.data.data;

      // Update order status in state
      setOrders(orders.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to update order status');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-900/30 text-green-400';
      case 'Paid':
        return 'bg-blue-900/30 text-blue-400';
      case 'In Process':
        return 'bg-amber-900/30 text-amber-400';
      case 'Out of Delivery':
        return 'bg-purple-900/30 text-purple-400';
      default:
        return 'bg-yellow-900/30 text-yellow-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FaCheck className="mr-1" />;
      case 'Paid':
        return <FaCheck className="mr-1" />;
      case 'In Process':
        return <FaClock className="mr-1" />;
      case 'Out of Delivery':
        return <FaTruck className="mr-1" />;
      default:
        return <FaClock className="mr-1" />;
    }
  };

  const getItemStatus = (item, orderStatus) => {
    // Determine item status based on overall order status
    if (orderStatus === 'Delivered') {
      return { status: 'Delivered', class: 'bg-green-900/30 text-green-400' };
    } else if (orderStatus === 'Out of Delivery') {
      return { status: 'Out for Delivery', class: 'bg-purple-900/30 text-purple-400' };
    } else if (orderStatus === 'In Process') {
      return { status: 'Preparing', class: 'bg-amber-900/30 text-amber-400' };
    } else if (orderStatus === 'Paid') {
      return { status: 'Confirmed', class: 'bg-blue-900/30 text-blue-400' };
    } else {
      return { status: 'Pending', class: 'bg-yellow-900/30 text-yellow-400' };
    }
  };

  const getOrderStatus = (order) => {
    return order.status || (order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending');
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 px-4 flex justify-center items-center">
        <div className="text-amber-400 text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-8">
          <h1 className="text-3xl font-bold mb-8">Order Management</h1>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-amber-100/80 text-xl">No orders found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-[#3c2a21]/30 rounded-xl border border-amber-900/30 overflow-hidden transition-all hover:border-amber-600/50">
                  {/* Order Header */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div>
                        <div className="font-mono text-amber-400">#{order._id.substring(0, 8)}</div>
                        <div className="text-amber-100/80 text-sm">
                          <FaCalendar className="inline mr-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <FaUser className="mr-2 text-amber-400" />
                          <div>
                            <div className="font-medium">{order.user?.name || 'N/A'}</div>
                            <div className="text-amber-100/80 text-sm">{order.user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <FaRupeeSign className="mr-1 text-amber-400" />
                          <span className="font-bold text-lg">{order.totalPrice}</span>
                        </div>
                        <div className="text-amber-100/80 text-sm">{order.orderItems?.length} items</div>
                      </div>
                      
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusClass(getOrderStatus(order))}`}>
                          {getStatusIcon(getOrderStatus(order))}
                          {getOrderStatus(order)}
                        </span>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'In Process')}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm flex items-center transition-colors"
                          >
                            <FaClock className="mr-1" />
                            In Process
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'Out of Delivery')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center transition-colors"
                          >
                            <FaTruck className="mr-1" />
                            Out of Delivery
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center transition-colors"
                          >
                            <FaCheck className="mr-1" />
                            Delivered
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expand/Collapse Button */}
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="text-amber-400 hover:text-amber-300 text-sm"
                      >
                        {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Order Details */}
                  {expandedOrder === order._id && (
                    <div className="border-t border-amber-900/30 p-6 bg-[#2D1B0E]/30">
                      <h3 className="text-xl font-bold mb-4">Order Items</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {order.orderItems?.map((item, index) => {
                          const itemStatus = getItemStatus(item, getOrderStatus(order));
                          // Get image from the populated menuItem data
                          const itemImage = item.menuItem?.image || item.image || null;
                          return (
                            <div key={index} className="bg-[#3c2a21]/50 rounded-lg p-4 flex items-center relative">
                              {itemImage ? (
                                <img 
                                  src={itemImage} 
                                  alt={item.name} 
                                  className="w-16 h-16 rounded-lg object-cover mr-4"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
                                  }}
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-amber-900/30 flex items-center justify-center mr-4">
                                  <FaBox className="text-amber-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-amber-100/80 text-sm">Qty: {item.quantity}</div>
                                <div className="flex items-center text-amber-400">
                                  <FaRupeeSign className="text-xs" />
                                  <span>{item.price * item.quantity}</span>
                                </div>
                              </div>
                              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs ${itemStatus.class}`}>
                                {itemStatus.status}
                              </div>
                            </div>
                          );
                        })}

                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-amber-900/20 rounded-lg p-4">
                          <h4 className="font-bold mb-2">Shipping Address</h4>
                          <p className="text-amber-100/80 text-sm">
                            {order.shippingAddress?.address}<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                            {order.shippingAddress?.country}
                          </p>
                        </div>
                        
                        <div className="bg-amber-900/20 rounded-lg p-4">
                          <h4 className="font-bold mb-2">Payment Method</h4>
                          <p className="text-amber-100/80">{order.paymentMethod}</p>
                        </div>
                        
                        <div className="bg-amber-900/20 rounded-lg p-4">
                          <h4 className="font-bold mb-2">Order Summary</h4>
                          <div className="space-y-1 text-amber-100/80 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>₹{order.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax</span>
                              <span>₹{order.taxPrice}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>₹{order.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between font-bold text-amber-400 pt-2">
                              <span>Total</span>
                              <span>₹{order.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;