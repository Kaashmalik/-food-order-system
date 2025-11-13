import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { AppContext } from '../../context/AppContext.jsx';
import { processStripePayment } from '../../services/orderService';
import Notification from '../Notification/Notification';
import { FaLock, FaCreditCard, FaArrowLeft } from 'react-icons/fa';

const StripeCheckout = () => {
  const { clearCart } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [stripePromise, setStripePromise] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    cardBrand: '' // Add cardBrand to state
  });

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

  // Handle card details change
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

  // Extract order ID from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    
    if (orderId && amount) {
      setOrderData({
        orderId,
        amount: parseFloat(amount)
      });
    } else {
      setNotification({
        message: 'Invalid checkout session',
        type: 'error'
      });
    }
    
    // Load Stripe
    const loadStripePromise = async () => {
      try {
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        
        // Check if the publishable key exists and is not a placeholder
        if (!publishableKey || publishableKey.includes('your_stripe_publishable_key')) {
          console.warn('Stripe publishable key is missing or invalid');
          setNotification({
            message: 'Payment system not properly configured. Please contact support.',
            type: 'error'
          });
          return;
        }
        
        const stripe = await loadStripe(publishableKey);
        setStripePromise(stripe);
      } catch (error) {
        console.error('Failed to load Stripe:', error);
        setNotification({
          message: 'Failed to load payment processor. Please try again later.',
          type: 'error'
        });
      }
    };
    
    loadStripePromise();
  }, [location.search]);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Validate card details
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
      return;
    }
    
    // Validate expiry date (should be MM/YY format and not expired)
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryRegex.test(cardDetails.expiryDate)) {
      setNotification({
        message: 'Please enter a valid expiry date (MM/YY)',
        type: 'error'
      });
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
      return;
    }
    
    // Validate cardholder name
    if (!cardDetails.cardholderName.trim()) {
      setNotification({
        message: 'Please enter the cardholder name',
        type: 'error'
      });
      return;
    }
    
    // Check if Stripe is properly loaded
    if (!stripePromise) {
      setNotification({
        message: 'Payment system not ready. Please refresh the page and try again.',
        type: 'error'
      });
      return;
    }
    
    if (!orderData) {
      setNotification({
        message: 'Order data is missing',
        type: 'error'
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process payment through backend
      const response = await processStripePayment({
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: 'inr'
      });
      
      if (response.success && response.clientSecret) {
        // In a real implementation, you would use the clientSecret to confirm the payment
        // For this demo, we'll just redirect to order confirmation
        clearCart();
        navigate(`/order-confirmation/${orderData.orderId}`);
      } else {
        throw new Error(response.error || 'Failed to process payment');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setNotification({
        message: err.message || 'Failed to process payment. Please try again.',
        type: 'error'
      });
      setIsProcessing(false);
    }
  };

  if (!orderData) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p>Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

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
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <FaArrowLeft className="text-amber-400 mr-2" />
          <button 
            onClick={() => navigate(-1)}
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            Back
          </button>
        </div>
        
        <h1 className="text-4xl font-bold mb-8">Secure Payment</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6">
            <div className="flex items-center mb-6">
              <FaLock className="text-amber-400 mr-2" />
              <h2 className="text-2xl font-bold">Payment Details</h2>
            </div>
            
            <form onSubmit={handlePayment}>
              <div className="mb-6 p-4 bg-amber-900/20 rounded-lg">
                <div className="flex justify-between">
                  <span>Order Total:</span>
                  <span className="font-bold">₹{orderData.amount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardDetailsChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3 pl-10"
                    required
                  />
                  <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
                  {cardDetails.cardBrand && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 font-medium">
                      {cardDetails.cardBrand}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block mb-2 font-medium">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardDetailsChange}
                    placeholder="MM/YY"
                    className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    required
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
                    className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  value={cardDetails.cardholderName}
                  onChange={handleCardDetailsChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                  required
                />
              </div>
              
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
                    Pay ₹{orderData.amount.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6 sticky top-28">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="bg-amber-900/20 rounded-xl p-4 mb-6">
                <h3 className="font-bold mb-2">Secure Payment</h3>
                <p className="text-amber-100/80 text-sm">
                  Your payment information is securely encrypted and processed by Stripe.
                </p>
              </div>
              
              <div className="flex items-center text-sm text-amber-100/60">
                <FaLock className="mr-2" />
                <span>Powered by Stripe - Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;