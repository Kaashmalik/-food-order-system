import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext.jsx';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft, FaLock } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart, getCartTotal, getCartItemCount } = useContext(AppContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Redirect to checkout page
    navigate('/checkout');
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <FaArrowLeft className="text-amber-400 mr-2" />
          <Link to="/menu" className="text-amber-400 hover:text-amber-300 transition-colors">Continue Shopping</Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <FaShoppingCart className="text-6xl text-amber-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-amber-100/80 mb-8">Add some delicious items to your cart</p>
            <Link to="/menu" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6">
                <h2 className="text-2xl font-bold mb-6">Items ({getCartItemCount()})</h2>
                
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item._id || item.id} className="flex items-center border-b border-amber-900/30 pb-6 last:border-0 last:pb-0">
                      <Link to={`/menu/${item.id}`} className="w-20 h-20 object-cover rounded-lg mr-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </Link>
                      
                      <div className="flex-grow">
                        <Link to={`/menu/${item.id}`} className="font-bold text-lg hover:text-amber-400 transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-amber-100/80 text-sm mb-2">{item.description}</p>
                        <p className="text-amber-400 font-bold">₹{item.price}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="bg-[#3c2a21] text-amber-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-amber-600/30 transition-colors"
                        >
                          <FaMinus />
                        </button>
                        <span className="mx-3 w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="bg-[#3c2a21] text-amber-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-amber-600/30 transition-colors"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      
                      <div className="ml-6 text-right">
                        <p className="font-bold">₹{item.price * item.quantity}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-amber-100/60 hover:text-amber-400 mt-2 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6 sticky top-28">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{(getCartTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>₹50.00</span>
                  </div>
                  <div className="border-t border-amber-900/30 pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{(getCartTotal() + (getCartTotal() * 0.1) + 50).toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-4 rounded-lg font-bold transition-colors flex items-center justify-center"
                >
                  <FaLock className="mr-2" />
                  Proceed to Checkout
                </button>
                
                <div className="mt-6 text-center text-amber-100/60 text-sm">
                  <p>Secure checkout powered by Food-Order-Easy</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;