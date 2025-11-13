import React, { useState, useEffect, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaStar, FaBolt, FaLeaf, FaUtensils, FaShoppingCart, FaUser, FaBars, FaTimes, FaFire, FaCrown, FaHeart, FaPlus } from 'react-icons/fa';
import { GiChefToque, GiForkKnifeSpoon } from 'react-icons/gi';
import { dummyMenuData as menuItemsData } from './assets/OmDD';
import { getMenuItems } from './services/menuService';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Menu from './components/Menu/Menu';
import MenuItemDetail from './components/MenuItemDetail/MenuItemDetail';
import Cart from './components/Cart/Cart';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Profile from './components/Profile/Profile';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import OrderConfirmation from './components/Order/OrderConfirmation';
import Checkout from './components/Checkout/Checkout';
import Wishlist from './components/Wishlist/Wishlist';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import NotFound from './components/NotFound/NotFound';
import SearchBar from './components/Search/SearchBar';
import CategoryFilter from './components/Category/CategoryFilter';
import FeaturedCarousel from './components/Carousel/FeaturedCarousel';
import PromotionalBanner from './components/Banner/PromotionalBanner';
import TestimonialSlider from './components/Testimonial/TestimonialSlider';
import LoadingSpinner from './components/Loading/LoadingSpinner';
import Notification from './components/Notification/Notification';
import StripeCheckout from './components/StripeCheckout/StripeCheckout';
import { AppProvider, AppContext } from './context/AppContext';
import AboutImage from './assets/AboutImage.png'; // Import the image

// Test to verify icons are working
console.log('Testing icon imports:');
console.log('FaArrowRight:', FaArrowRight);
console.log('FaStar:', FaStar);
console.log('FaBolt:', FaBolt);
console.log('FaLeaf:', FaLeaf);
console.log('GiChefToque:', GiChefToque);
console.log('FaUtensils:', FaUtensils);
console.log('FaShoppingCart:', FaShoppingCart);
console.log('FaUser:', FaUser);
console.log('FaBars:', FaBars);
console.log('FaTimes:', FaTimes);
console.log('FaFire:', FaFire);

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [notification, setNotification] = useState(null);
  const { getCartItemCount, addToCart, addToWishlist, removeFromWishlist, user, wishlistItems } = useContext(AppContext);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load menu items
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const data = await getMenuItems();
      console.log('Menu items loaded in App.jsx:', data.data);
      setMenuItems(data.data);
      
      // Set featured items (only popular or best sellers)
      const featured = data.data.filter(item => item.isPopular || item.isBestSeller);
      
      console.log('All menu items:', data.data);
      console.log('Featured items (popular/best sellers):', featured);
      console.log('Menu items length:', data.data.length);
      
      setFeaturedItems(featured);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load menu items', err);
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Navigate to menu page with search query
    if (query) {
      navigate(`/menu?search=${encodeURIComponent(query)}`);
    }
  };

  // Filter menu items based on search and category
  const filteredItems = menuItems.filter(item => 
    (searchQuery ? 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) :
      true) &&
    (activeCategory === 'all' || item.category === activeCategory)
  );

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'appetizer', name: 'Appetizers' },
    { id: 'main-course', name: 'Main Course' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'beverage', name: 'Beverages' }
  ];

  // Toggle video play/pause
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle add to cart
  const handleAddToCart = (item) => {
    // Add item to cart with default quantity of 1
    addToCart({ ...item, quantity: 1 });
  };

  // Handle add to wishlist with toggle functionality
  const handleAddToWishlist = async (menuItemId) => {
    if (!user) {
      setNotification({
        message: 'Please login to add items to your wishlist',
        type: 'warning'
      });
      return;
    }
    
    try {
      // Check if item is already in wishlist
      const isInWishlist = wishlistItems.some(item => item._id === menuItemId);
      
      if (isInWishlist) {
        // Remove from wishlist
        await removeFromWishlist(menuItemId);
        setNotification({
          message: 'Item removed from wishlist!',
          type: 'success'
        });
      } else {
        // Add to wishlist
        await addToWishlist(menuItemId);
        setNotification({
          message: 'Item added to wishlist!',
          type: 'success'
        });
      }
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to update wishlist',
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a120b] to-[#3c2a21] text-amber-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
      
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Delicious Food <span className="text-amber-400">Delivered</span> to You
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto text-amber-100/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Experience the best culinary delights from our curated menu, delivered fresh to your doorstep in 30 minutes or less.
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <SearchBar onSearch={handleSearch} placeholder="Search for dishes, ingredients, or categories..." />
            </motion.div>
          </div>
          
          {/* Featured Carousel */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <FeaturedCarousel items={featuredItems} />
          </motion.div>
          
          {/* Featured Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-12 p-4 bg-amber-900/10 rounded-2xl">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden border-8 border-amber-900/30 shadow-2xl transform transition-transform duration-500">
                  <img 
                    src={AboutImage} 
                    alt="Why Choose Us" 
                    className="w-full h-auto object-contain max-h-[600px]"
                  />

                  

                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-rose-500/10"></div>
                </div>

                {/* Chef's Special */}
                  <section className="py-10 px-4 relative z-10">
                    <div className="max-w-7xl mx-auto">
                      <div className="absolute -bottom-8 -left-8 bg-[#2D1B0E] border-4 border-amber-600 rounded-2xl p-4 shadow-xl transform transition-transform duration-300 hover:scale-105">
                        <div className="flex items-center">
                          {menuItems.length > 0 ? (
                            <>
                              <div className="relative">
                                <img 
                                  src={menuItems[0]?.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'} 
                                  alt="Chef's Special" 
                                  className="w-20 h-20 rounded-full object-cover border-2 border-amber-500 shadow-lg"
                                />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                                  <FaStar className="text-sm text-white" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h3 className="font-bold text-amber-50 text-lg">Chef's Special</h3>
                                <Link to={`/menu/${menuItems[0]._id}`} className="text-amber-400 text-sm hover:text-amber-300 transition-colors">
                                  {menuItems[0]?.name || 'Special Item'}
                                </Link>
                              </div>
                            </>
                          ) : (
                            <div className="text-amber-400 text-sm">More items available soon</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

              </div>
            </div>
            
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-rose-500/20 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                  <motion.h2 
                    className="text-4xl font-bold mb-8 relative inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    Why Choose Us?
                    <div className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-amber-400 to-rose-500 rounded-full"></div>
                  </motion.h2>
                  
                  <div className="space-y-8">
                    {[
                      { 
                        icon: <FaBolt className="text-2xl" />, 
                        title: "Lightning Fast Delivery", 
                        text: "30-minute delivery guarantee in metro areas with real-time tracking",
                        color: "from-amber-400 to-orange-500",
                        delay: 0.1
                      },
                      { 
                        icon: <GiChefToque className="text-2xl" />, 
                        title: "Master Chefs", 
                        text: "Michelin-star trained culinary experts crafting exquisite dishes",
                        color: "from-rose-400 to-pink-600",
                        delay: 0.2
                      },
                      { 
                        icon: <FaLeaf className="text-2xl" />, 
                        title: "Premium Quality", 
                        text: "Locally sourced organic ingredients for the freshest flavors",
                        color: "from-emerald-400 to-cyan-600",
                        delay: 0.3
                      }
                    ].map((feature, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-start group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: feature.delay }}
                        viewport={{ once: true }}
                        whileHover={{ x: 10 }}
                      >
                        <div className={`p-3 rounded-xl mr-4 bg-gradient-to-r ${feature.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-amber-50">{feature.title}</h3>
                          <p className="text-amber-100/80">{feature.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Link 
                      to="/about" 
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Learn More About Us
                      <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      

      {/* Menu Section */}
      <section id="menu" className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Delicious Menu
              <span className="absolute bottom-[-10px] left-0 w-24 h-1 bg-amber-500 rounded-full"></span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to="/menu" className="flex items-center text-amber-400 hover:text-amber-300 transition-colors">
                View All Menu
                <FaArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
          
          {/* Menu Items Preview - Only show special, popular, and best seller items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems
              .filter(item => item.isSpecial || item.isPopular || item.isBestSeller)
              .slice(0, 4)
              .map((item, index) => (
              <motion.div 
                key={item._id} 
                className="bg-[#2D1B0E]/50 rounded-xl overflow-hidden border border-amber-900/30 hover:border-amber-600/50 transition-all group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/menu/${item._id}`)}
              >
                <div className="relative overflow-hidden">
                  <motion.img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {item.isPopular && (
                      <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center">
                        <FaFire className="mr-1 text-xs" /> Popular
                      </span>
                    )}
                    {item.isBestSeller && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center">
                        <FaCrown className="mr-1 text-xs" /> Best
                      </span>
                    )}
                    {item.isSpecial && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                        Special
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-amber-400 font-bold">Rs{item.price}</span>
                  </div>
                  <p className="text-amber-100/80 text-xs mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FaStar className="text-amber-400 text-sm" />
                      <span className="ml-1 text-sm font-medium">{item.rating}</span>
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(item._id);
                        }}
                        className={`p-1.5 rounded-full transition-colors transform hover:scale-110 ${
                          wishlistItems.some(wishlistItem => wishlistItem._id === item._id)
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'bg-amber-900 hover:bg-amber-800 text-white'
                        }`}
                        aria-label={
                          wishlistItems.some(wishlistItem => wishlistItem._id === item._id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <FaHeart 
                          className="text-xs" 
                          style={{
                            fill: wishlistItems.some(wishlistItem => wishlistItem._id === item._id) 
                              ? 'currentColor' 
                              : 'none',
                            stroke: wishlistItems.some(wishlistItem => wishlistItem._id === item._id) 
                              ? 'none' 
                              : 'currentColor'
                          }} 
                        />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white p-1.5 rounded-full transition-colors transform hover:scale-110"
                        aria-label="Add to cart"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '10M+', label: 'Happy Customers', icon: <FaUser /> },
              { number: '98%', label: 'Satisfaction Rate', icon: <FaStar /> },
              { number: '500+', label: 'Cities Served', icon: <GiForkKnifeSpoon /> },
              { number: '24/7', label: 'Support Available', icon: <FaBolt /> }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#2D1B0E] to-[#3c2a21] border border-amber-900/30 hover:border-amber-600/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                <p className="text-amber-100/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner - Moved here */}
      <section className="py-10 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <PromotionalBanner />
        </div>
      </section>

       {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#2D1B0E] to-[#3c2a21] rounded-3xl p-12 border border-amber-900/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="relative z-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to Order?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto text-amber-100/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of satisfied customers enjoying our delicious meals delivered fresh to their doorstep.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link 
                to="/menu" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-900/30"
              >
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Order Now
                </motion.span>
              </Link>
              <Link 
                to="/contact" 
                className="bg-transparent border-2 border-amber-600 text-amber-400 hover:bg-amber-600/20 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Contact Us
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            What Our Customers Say
            <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-24 h-1 bg-amber-500 rounded-full"></span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Food Blogger",
                text: "The quality and taste of the food exceeded my expectations. Fast delivery and excellent packaging!",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Michael Chen",
                role: "Chef",
                text: "As a professional chef, I appreciate the quality of ingredients and the skill in preparation.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Emma Rodriguez",
                role: "Regular Customer",
                text: "I've been ordering for months now and the consistency is remarkable. Highly recommended!",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-[#2D1B0E]/50 p-8 rounded-xl border border-amber-900/30 hover:border-amber-600/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-amber-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-amber-100/80 italic">"{testimonial.text}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-amber-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notification System */}
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;