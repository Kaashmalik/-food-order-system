import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext.jsx';
import { createOrder, createPayment } from '../../services/orderService';
import Notification from '../Notification/Notification';
import { FaArrowLeft, FaLock, FaCreditCard, FaMoneyBillWave, FaStripe } from 'react-icons/fa';

const Checkout = () => {
  const { user, cartItems, getCartTotal, clearCart } = useContext(AppContext);
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    cardBrand: '' // Add cardBrand to state
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    // Load Stripe only when component mounts
    const loadStripePromise = async () => {
      try {
        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        setStripePromise(stripe);
      } catch (error) {
        console.error('Failed to load Stripe:', error);
      }
    };
    
    loadStripePromise();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Remove all non-digit characters
      const cleanedValue = value.replace(/\D/g, '');
      
      // Limit to 19 digits (covers most card types including Amex)
      const limitedValue = cleanedValue.slice(0, 19);
      
      // Format based on card type
      let formattedValue = limitedValue;
      
      // American Express (15 digits) - 4-6-5 format
      if (limitedValue.startsWith('34') || limitedValue.startsWith('37')) {
        formattedValue = limitedValue
          .replace(/(\d{4})/, '$1 ')
          .replace(/(\d{4})\s(\d{6})/, '$1 $2 ')
          .trim();
      } 
      // Standard cards (16 digits) - 4-4-4-4 format
      else {
        formattedValue = limitedValue
          .replace(/(\d{4})/g, '$1 ')
          .trim();
      }
      
      setCardDetails(prev => ({
        ...prev,
        [name]: formattedValue,
        cardBrand: getCardBrand(limitedValue)
      }));
    } 
    else if (name === 'expiryDate') {
      // Auto-format expiry date as MM/YY
      let formattedValue = value.replace(/\D/g, '');
      
      // Limit to 4 digits
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
      
      // Limit total length
      formattedValue = formattedValue.substring(0, 5);
      
      setCardDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
    else if (name === 'cvv') {
      // Limit CVV to 4 digits (Amex) or 3 digits (others)
      const maxLength = cardDetails.cardBrand === 'American Express' ? 4 : 3;
      const formattedValue = value.replace(/\D/g, '').slice(0, maxLength);
      
      setCardDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
    else {
      setCardDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Function to detect card brand
  const getCardBrand = (cardNumber) => {
    const cleanedNumber = cardNumber.replace(/\D/g, '');
    
    // American Express
    if (/^3[47]\d{13}$/.test(cleanedNumber)) {
      return 'American Express';
    }
    // Visa
    if (/^4\d{12}(\d{3})?$/.test(cleanedNumber)) {
      return 'Visa';
    }
    // Mastercard
    if (/^5[1-5]\d{14}$|^2[2-7]\d{14}$/.test(cleanedNumber)) {
      return 'Mastercard';
    }
    // Discover
    if (/^6(?:011\d{12}|5\d{14})$/.test(cleanedNumber)) {
      return 'Discover';
    }
    // RuPay
    if (/^60\d{14}$|^652150\d{10}$|^652151\d{10}$|^652152\d{10}$|^652153\d{10}$|^652154\d{10}$|^652155\d{10}$|^652156\d{10}$|^652157\d{10}$|^652158\d{10}$|^652159\d{10}$|^652160\d{10}$|^652161\d{10}$|^652162\d{10}$|^652163\d{10}$|^652164\d{10}$|^652165\d{10}$|^652166\d{10}$|^652167\d{10}$|^652168\d{10}$|^652169\d{10}$|^652170\d{10}$|^652171\d{10}$|^652172\d{10}$|^652173\d{10}$|^652174\d{10}$|^652175\d{10}$|^652176\d{10}$|^652177\d{10}$|^652178\d{10}$|^652179\d{10}$/.test(cleanedNumber)) {
      return 'RuPay';
    }
    // Diners Club
    if (/^3(?:0[0-5]|[68]\d)\d{11}$/.test(cleanedNumber)) {
      return 'Diners Club';
    }
    // JCB
    if (/^(?:2131|1800|35\d{3})\d{11}$/.test(cleanedNumber)) {
      return 'JCB';
    }
    
    return 'Unknown';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Validate card details if card payment is selected
    if ((paymentMethod === 'Debit Card' || paymentMethod === 'Credit Card')) {
      // Validate card number
      const cleanedCardNumber = cardDetails.cardNumber.replace(/\s/g, '');
      const cardBrand = getCardBrand(cleanedCardNumber);
      
      // Check if card number is valid for the detected brand
      let isValidLength = false;
      switch (cardBrand) {
        case 'American Express':
          isValidLength = cleanedCardNumber.length === 15;
          break;
        case 'Diners Club':
          isValidLength = cleanedCardNumber.length === 14;
          break;
        default:
          isValidLength = cleanedCardNumber.length === 16;
      }
      
      if (!isValidLength) {
        setNotification({
          message: `Please enter a valid ${cardBrand} card number`,
          type: 'error'
        });
        setIsProcessing(false);
        return;
      }
      
      // Validate expiry date (should be MM/YY format and not expired)
      const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
      if (!expiryRegex.test(cardDetails.expiryDate)) {
        setNotification({
          message: 'Please enter a valid expiry date (MM/YY)',
          type: 'error'
        });
        setIsProcessing(false);
        return;
      }
      
      // Check if card is expired
      const [expMonth, expYear] = cardDetails.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(expYear) < currentYear || 
          (parseInt(expYear) === currentYear && parseInt(expMonth) < currentMonth)) {
        setNotification({
          message: 'Card has expired',
          type: 'error'
        });
        setIsProcessing(false);
        return;
      }
      
      // Validate CVV
      const expectedCvvLength = cardBrand === 'American Express' ? 4 : 3;
      const cvvRegex = new RegExp(`^[0-9]{${expectedCvvLength}}$`);
      if (!cvvRegex.test(cardDetails.cvv)) {
        setNotification({
          message: `Please enter a valid ${expectedCvvLength}-digit CVV`,
          type: 'error'
        });
        setIsProcessing(false);
        return;
      }
      
      // Validate cardholder name
      if (!cardDetails.cardholderName.trim()) {
        setNotification({
          message: 'Please enter the cardholder name',
          type: 'error'
        });
        setIsProcessing(false);
        return;
      }
    }
    
    try {
      // Prepare order data
      const orderData = {
        orderItems: cartItems.map(item => ({
          menuItem: item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: getCartTotal(),
        taxPrice: getCartTotal() * 0.1,
        shippingPrice: 50,
        totalPrice: getCartTotal() + (getCartTotal() * 0.1) + 50
      };
      
      // Create order
      const order = await createOrder(orderData);
      
      // Handle payment based on payment method
      if (paymentMethod === 'Cash on Delivery') {
        // For COD, just create a payment record
        await createPayment({
          orderId: order._id,
          paymentMethod: 'Cash on Delivery',
          amount: order.totalPrice
        });
        
        // Clear cart
        clearCart();
        
        // Redirect to order confirmation
        navigate(`/order-confirmation/${order._id}`);
      } else if (paymentMethod === 'Debit Card' || paymentMethod === 'Credit Card') {
        // For card payments, create payment record with card details
        // Extract last 4 digits from formatted card number
        const cleanedCardNumber = cardDetails.cardNumber.replace(/\s/g, '');
        const last4 = cleanedCardNumber.slice(-4);
        const cardBrand = getCardBrand(cleanedCardNumber);
        
        await createPayment({
          orderId: order._id,
          paymentMethod: paymentMethod,
          amount: order.totalPrice,
          cardDetails: {
            last4: last4,
            brand: cardBrand || (paymentMethod === 'Debit Card' ? 'Debit' : 'Credit'),
            expiryMonth: cardDetails.expiryDate.split('/')[0],
            expiryYear: cardDetails.expiryDate.split('/')[1]
          }
        });
        
        // Clear cart
        clearCart();
        
        // Redirect to order confirmation
        navigate(`/order-confirmation/${order._id}`);
      } else if (paymentMethod === 'Stripe') {
        // For Stripe payments, redirect to Stripe checkout
        navigate(`/stripe-checkout?orderId=${order._id}&amount=${order.totalPrice}`);
      }
    } catch (err) {
      console.error('Failed to create order', err);
      setNotification({
        message: err.message || 'Failed to process order. Please try again.',
        type: 'error'
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <FaArrowLeft className="text-amber-400 mr-2" />
          <Link to="/cart" className="text-amber-400 hover:text-amber-300 transition-colors">Back to Cart</Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <label className="block mb-2 font-medium">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleAddressChange}
                      required
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                      placeholder="123 Main Street"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      required
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                      placeholder="New York"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleAddressChange}
                      required
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                      placeholder="10001"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block mb-2 font-medium">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      required
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                      placeholder="United States"
                    />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {/* Cash on Delivery */}
                  <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery' 
                      ? 'border-amber-600 bg-amber-600/20' 
                      : 'border-amber-900/30 hover:border-amber-600/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="hidden"
                    />
                    <div className="flex items-center">
                      <FaMoneyBillWave className="text-2xl mr-3 text-amber-400" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                  </label>
                  
                  {/* Debit Card */}
                  <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'Debit Card' 
                      ? 'border-amber-600 bg-amber-600/20' 
                      : 'border-amber-900/30 hover:border-amber-600/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Debit Card"
                      checked={paymentMethod === 'Debit Card'}
                      onChange={() => setPaymentMethod('Debit Card')}
                      className="hidden"
                    />
                    <div className="flex items-center">
                      <FaCreditCard className="text-2xl mr-3 text-amber-400" />
                      <span className="font-medium">Debit Card</span>
                    </div>
                  </label>
                  
                  {/* Credit Card */}
                  <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'Credit Card' 
                      ? 'border-amber-600 bg-amber-600/20' 
                      : 'border-amber-900/30 hover:border-amber-600/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit Card"
                      checked={paymentMethod === 'Credit Card'}
                      onChange={() => setPaymentMethod('Credit Card')}
                      className="hidden"
                    />
                    <div className="flex items-center">
                      <FaCreditCard className="text-2xl mr-3 text-amber-400" />
                      <span className="font-medium">Credit Card</span>
                    </div>
                  </label>
                  
                  {/* Stripe */}
                  <label className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'Stripe' 
                      ? 'border-amber-600 bg-amber-600/20' 
                      : 'border-amber-900/30 hover:border-amber-600/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Stripe"
                      checked={paymentMethod === 'Stripe'}
                      onChange={() => setPaymentMethod('Stripe')}
                      className="hidden"
                    />
                    <div className="flex items-center">
                      <FaStripe className="text-2xl mr-3 text-amber-400" />
                      <span className="font-medium">Stripe</span>
                    </div>
                  </label>
                </div>
                
                {/* Payment Form for Card Payments */}
                {(paymentMethod === 'Debit Card' || paymentMethod === 'Credit Card') && (
                  <div className="mb-8 bg-[#3c2a21] rounded-xl p-6 border border-amber-900/30">
                    <h3 className="text-xl font-bold mb-4">Card Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <label className="block mb-2 font-medium">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleCardDetailsChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3 pl-10"
                          />
                          <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
                          {cardDetails.cardBrand && (
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 font-medium">
                              {cardDetails.cardBrand}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardDetails.expiryDate}
                          onChange={handleCardDetailsChange}
                          placeholder="MM/YY"
                          required
                          className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardDetailsChange}
                          placeholder="123"
                          required
                          className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block mb-2 font-medium">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={cardDetails.cardholderName}
                          onChange={handleCardDetailsChange}
                          placeholder="John Doe"
                          required
                          className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Payment Form for Stripe */}
                {paymentMethod === 'Stripe' && (
                  <div className="mb-8 bg-[#3c2a21] rounded-xl p-6 border border-amber-900/30">
                    <h3 className="text-xl font-bold mb-4">Stripe Payment</h3>
                    <div className="text-amber-100/80 mb-4">
                      You will be redirected to Stripe to complete your payment securely.
                    </div>
                    <div className="flex items-center text-sm text-amber-100/60">
                      <FaLock className="mr-2" />
                      <span>Powered by Stripe - Secure payment processing</span>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-4 rounded-lg font-bold transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <FaLock className="mr-2" />
                      Place Order
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6 sticky top-28">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id || item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-lg mr-3"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
                        }}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-amber-100/80 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
                
                <div className="border-t border-amber-900/30 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{(getCartTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹50.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>₹{(getCartTotal() + (getCartTotal() * 0.1) + 50).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-900/20 rounded-xl p-4">
                <h3 className="font-bold mb-2">Secure Checkout</h3>
                <p className="text-amber-100/80 text-sm">
                  Your payment information is securely encrypted and processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;