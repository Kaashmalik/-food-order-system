import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext.jsx';
import { FaShoppingCart, FaTrash, FaTimes } from 'react-icons/fa';

const CartDropdown = () => {
  const { cartItems, removeFromCart, getCartTotal, getCartItemCount } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate total item count
  const totalItems = getCartItemCount();

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <FaShoppingCart className="text-xl" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#2D1B0E] border-2 border-amber-700 rounded-xl shadow-2xl z-50">
          <div className="p-4 border-b border-amber-900/30 flex justify-between items-center">
            <h3 className="font-bold">Your Cart ({totalItems})</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-amber-400 hover:text-amber-300"
            >
              <FaTimes />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="p-8 text-center">
              <FaShoppingCart className="text-3xl text-amber-400 mx-auto mb-4" />
              <p className="text-amber-100/80">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id || item.id} className="p-4 border-b border-amber-900/30 flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-grow">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-amber-400 text-sm">₹{item.price} × {item.quantity}</p>
                      <p className="text-amber-100/80 text-xs">Total: ₹{item.price * item.quantity}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item._id || item.id)}
                      className="text-amber-100/60 hover:text-amber-400"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-amber-900/30">
                <div className="flex justify-between mb-4">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-amber-400">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    to="/cart" 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-center text-sm transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link 
                    to="/checkout" 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-amber-900 hover:bg-amber-800 text-white py-2 rounded-lg text-center text-sm transition-colors"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;