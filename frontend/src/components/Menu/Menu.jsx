import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getMenuItems } from '../../services/menuService';
import SearchBar from '../Search/SearchBar';
import CategoryFilter from '../Category/CategoryFilter';
import SkeletonLoader from '../Loading/SkeletonLoader';
import Notification from '../Notification/Notification';
import { AppContext } from '../../context/AppContext.jsx';
import { FaShoppingCart, FaStar, FaFire, FaCrown, FaTag, FaPlus, FaHeart } from 'react-icons/fa';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const { addToCart, addToWishlist, user } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const navigate = useNavigate();

  useEffect(() => {
    loadMenuItems();
  }, []);

  useEffect(() => {
    // Apply search filter when search query changes
    if (searchQuery) {
      const filtered = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(menuItems);
    }
  }, [searchQuery, menuItems]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const data = await getMenuItems();
      setMenuItems(data.data);
      setFilteredItems(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    // Update search params in URL
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const handleAddToCart = (item) => {
    // Add item to cart with default quantity of 1
    addToCart({ ...item, quantity: 1 });
    
    // Show notification
    setNotification({
      message: `${item.name} added to cart!`,
      type: 'success'
    });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddToWishlist = async (menuItemId) => {
    if (!user) {
      setNotification({
        message: 'Please login to add items to your wishlist',
        type: 'warning'
      });
      return;
    }
    
    try {
      await addToWishlist(menuItemId);
      setNotification({
        message: 'Item added to wishlist!',
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: 'Failed to add item to wishlist',
        type: 'error'
      });
    }
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'appetizer', name: 'Appetizers' },
    { id: 'main-course', name: 'Main Course' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'beverage', name: 'Beverages' }
  ];

  const filteredCategoryItems = filteredItems.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

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

      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Our <span className="text-amber-400">Delicious</span> Menu
        </h1>
        <p className="text-xl max-w-3xl mx-auto text-amber-100/80 mb-8">
          Explore our carefully curated selection of dishes made with the finest ingredients and culinary expertise.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar onSearch={handleSearch} placeholder="Search for dishes, ingredients, or categories..." />
        </div>
      </section>

      {/* Category Filters */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto">
          <CategoryFilter 
            categories={categories} 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />
        </div>
      </section>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto mb-6">
          <p className="text-amber-100/80">
            Showing results for: <span className="text-amber-400 font-medium">"{searchQuery}"</span>
            <button 
              onClick={() => handleSearch('')}
              className="ml-4 text-amber-400 hover:text-amber-300 transition-colors"
            >
              Clear search
            </button>
          </p>
        </div>
      )}

      {/* Menu Items */}
      <section>
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <SkeletonLoader type="card" count={8} />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-400 text-xl">Error: {error}</div>
            </div>
          ) : filteredCategoryItems.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4">No items found</h3>
              <p className="text-amber-100/80">
                {searchQuery 
                  ? `No items match your search for "${searchQuery}". Try different keywords.`
                  : 'Try adjusting your search or category filter'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCategoryItems.map((item) => (
                <div 
                  key={item._id} 
                  className="bg-[#2D1B0E]/50 rounded-xl overflow-hidden border border-amber-900/30 hover:border-amber-600/50 transition-all group cursor-pointer"
                  onClick={() => navigate(`/menu/${item._id}`)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Badges */}
                    {item.isPopular && (
                      <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center">
                        <FaFire className="mr-1" /> Popular
                      </span>
                    )}
                    {item.isBestSeller && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center">
                        <FaCrown className="mr-1" /> Best Seller
                      </span>
                    )}
                    {item.isSpecial && (
                      <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                        Special
                      </span>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold hover:text-amber-400 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-amber-400 font-bold text-lg">₹{item.price}</span>
                    </div>
                    <p className="text-amber-100/80 text-sm mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaStar className="text-amber-400" />
                        <span className="ml-1 font-medium">{item.rating}</span>
                        <span className="text-amber-100/60 text-sm ml-2">({item.numOfReviews})</span>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(item._id);
                          }}
                          className="bg-amber-900 hover:bg-amber-800 text-white p-2 rounded-full transition-colors"
                        >
                          <FaHeart />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full transition-colors"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Menu;