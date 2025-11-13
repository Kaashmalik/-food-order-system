import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext.jsx';
import { FaHeart, FaTrash, FaArrowLeft, FaStar, FaShoppingCart } from 'react-icons/fa';

const Wishlist = () => {
  const { user, wishlistItems, removeFromWishlist, addToCart, loadWishlist } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      loadWishlist().then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRemoveFromWishlist = async (menuItemId) => {
    await removeFromWishlist(menuItemId);
  };

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
  };

  if (!user) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FaHeart className="text-6xl text-amber-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-6">Your Wishlist</h1>
          <p className="text-xl text-amber-100/80 mb-8">
            Please login to view and manage your wishlist
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/login" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-transparent border-2 border-amber-600 text-amber-400 hover:bg-amber-600/20 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 flex justify-center items-center">
        <div className="text-amber-400 text-xl">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <FaArrowLeft className="text-amber-400 mr-2" />
          <Link to="/menu" className="text-amber-400 hover:text-amber-300 transition-colors">Back to Menu</Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8">Your Wishlist ({wishlistItems.length})</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <FaHeart className="text-6xl text-amber-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-amber-100/80 mb-8">Start adding items you love to your wishlist</p>
            <Link 
              to="/menu" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((item) => (
              <div key={item._id} className="bg-[#2D1B0E]/50 rounded-xl overflow-hidden border border-amber-900/30 hover:border-amber-600/50 transition-all group">
                <div className="relative overflow-hidden">
                  <Link to={`/menu/${item._id}`}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-48 object-cover cursor-pointer"
                    />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <button 
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="absolute top-3 right-3 bg-amber-600 text-white p-2 rounded-full shadow-lg hover:bg-amber-700 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Link to={`/menu/${item._id}`} className="text-xl font-semibold hover:text-amber-400 transition-colors">
                      {item.name}
                    </Link>
                    <span className="text-amber-400 font-bold text-lg">₹{item.price}</span>
                  </div>
                  
                  <p className="text-amber-100/80 text-sm mb-4">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FaStar className="text-amber-400" />
                      <span className="ml-1 font-medium">{item.rating}</span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
                    >
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;