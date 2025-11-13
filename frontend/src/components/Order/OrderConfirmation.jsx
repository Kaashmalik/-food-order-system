import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';
import { FaCheckCircle, FaUtensils, FaTruck, FaHome, FaDownload } from 'react-icons/fa';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load order', err);
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for receipt
  const formatReceiptDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Download receipt as PDF
  const downloadReceipt = () => {
    const printContent = receiptRef.current;
    if (!printContent) {
      console.error('Receipt content not found');
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt - ${order._id.substring(0, 8)}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              color: #333;
              background: #fff;
            }
            .receipt-header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .receipt-header h1 {
              margin: 0 0 10px 0;
              color: #d97706;
              font-size: 28px;
            }
            .receipt-header p {
              margin: 5px 0;
              color: #666;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 12px;
              color: #d97706;
              font-size: 18px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .info-item {
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: 600;
              display: inline-block;
              width: 150px;
              color: #555;
            }
            .item-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            .item-table th {
              background-color: #f8f9fa;
              padding: 10px;
              text-align: left;
              border-bottom: 2px solid #ddd;
            }
            .item-table td {
              padding: 10px;
              border-bottom: 1px solid #eee;
            }
            .text-right {
              text-align: right;
            }
            .total-row {
              font-weight: bold;
              font-size: 1.1em;
              background-color: #f8f9fa;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #777;
              font-size: 14px;
            }
            @media print {
              body {
                padding: 10px;
              }
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait a bit for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 flex justify-center items-center">
        <div className="text-amber-400 text-xl">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-24 pb-16 px-4 flex justify-center items-center">
        <div className="text-red-400 text-xl">Order not found</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-amber-100/80">
            Thank you for your order. We're preparing your delicious meal.
          </p>
        </div>

        <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-8 mb-8">
          {/* Hidden receipt content for printing */}
          <div ref={receiptRef} className="hidden">
            <div className="receipt-header">
              <h1>FOOD ORDER EASY</h1>
              <p>Order Receipt</p>
              <p>Order ID: #{order._id.substring(0, 8)}</p>
              <p>Date: {formatReceiptDate(order.createdAt)}</p>
            </div>
            
            <div className="section">
              <div className="section-title">Customer Information</div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span>{order.user?.name || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span>{order.user?.email || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Order ID:</span>
                  <span>#{order._id.substring(0, 8)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Order Date:</span>
                  <span>{formatReceiptDate(order.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="section">
              <div className="section-title">Delivery Address</div>
              <div className="info-item">
                <span className="info-label">Address:</span>
                <span>{order.shippingAddress?.address || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">City:</span>
                <span>{order.shippingAddress?.city || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Postal Code:</span>
                <span>{order.shippingAddress?.postalCode || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Country:</span>
                <span>{order.shippingAddress?.country || 'N/A'}</span>
              </div>
            </div>
            
            <div className="section">
              <div className="section-title">Order Items</div>
              <table className="item-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td className="text-right">₹{item.price}</td>
                      <td className="text-right">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="section">
              <div className="section-title">Order Summary</div>
              <table className="item-table">
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td className="text-right">₹{order.itemsPrice}</td>
                  </tr>
                  <tr>
                    <td>Tax</td>
                    <td className="text-right">₹{order.taxPrice}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td className="text-right">₹{order.shippingPrice}</td>
                  </tr>
                  <tr className="total-row">
                    <td><strong>Total</strong></td>
                    <td className="text-right"><strong>₹{order.totalPrice}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="section">
              <div className="section-title">Payment Information</div>
              <div className="info-item">
                <span className="info-label">Payment Method:</span>
                <span>{order.paymentMethod || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Payment Status:</span>
                <span className="text-green-600 font-medium">Paid</span>
              </div>
            </div>
            
            <div className="footer">
              <p>Thank you for your order!</p>
              <p>This is an automated receipt. No signature required.</p>
              <p>If you have any questions, please contact us at support@foodordereasy.com</p>
            </div>
          </div>
          
          {/* Visible content */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Order #{order._id.substring(0, 8)}</h2>
              <p className="text-amber-100/80">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <button 
                onClick={downloadReceipt}
                className="flex items-center bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <FaDownload className="mr-2" />
                Download Receipt
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#3c2a21] p-4 rounded-xl">
              <h3 className="font-bold mb-2 flex items-center">
                <FaUtensils className="mr-2 text-amber-400" />
                Order Status
              </h3>
              <p className="text-green-400 font-medium">Confirmed</p>
            </div>
            
            <div className="bg-[#3c2a21] p-4 rounded-xl">
              <h3 className="font-bold mb-2 flex items-center">
                <FaTruck className="mr-2 text-amber-400" />
                Delivery Status
              </h3>
              <p className="text-yellow-400 font-medium">Preparing</p>
            </div>
            
            <div className="bg-[#3c2a21] p-4 rounded-xl">
              <h3 className="font-bold mb-2 flex items-center">
                <FaHome className="mr-2 text-amber-400" />
                Delivery Address
              </h3>
              <p className="text-amber-100/80">
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center border-b border-amber-900/30 pb-4 last:border-0 last:pb-0">
                {/* Use the image from the populated menuItem data if available, otherwise fallback to item.image */}
                <img 
                  src={item.menuItem?.image || item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
                  }}
                />
                <div className="flex-grow">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-amber-100/80">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-amber-900/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-4">Payment Information</h3>
                <p className="mb-2">Payment Method: <span className="font-medium">{order.paymentMethod}</span></p>
                <p className="text-green-400 font-medium">Payment Status: Paid</p>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-2">
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
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-amber-900/30">
                    <span>Total</span>
                    <span>₹{order.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-amber-100/80 mb-6">
            We'll send you an email confirmation with tracking information once your order is on the way.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/menu" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
            <Link 
              to="/profile" 
              className="bg-transparent border-2 border-amber-600 text-amber-400 hover:bg-amber-600/20 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;