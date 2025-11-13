import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiBook,
  FiStar,
  FiPhone,
  FiLogOut,
  FiKey,
  FiMenu,
  FiX,
  FiUser,
  FiHeart
} from 'react-icons/fi';
import { GiChefToque, GiForkKnifeSpoon } from 'react-icons/gi';
import { AppContext } from '../../context/AppContext.jsx';
import CartDropdown from '../Cart/CartDropdown';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, wishlistItems } = useContext(AppContext);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', to: '/', icon: <FiHome /> },
    { name: 'Menu', to: '/menu', icon: <FiBook /> },
    { name: 'About', to: '/about', icon: <FiStar /> },
    { name: 'Contact', to: '/contact', icon: <FiPhone /> },
  ];

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#2D1B0E]/90 backdrop-blur-md py-3 shadow-xl' : 'bg-transparent py-6'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center space-x-2 group">
              <GiChefToque className="text-3xl text-amber-500 transition-transform group-hover:rotate-12" />
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Food-Order-Easy
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Link 
                  key={index} 
                  to={link.to} 
                  className="font-medium hover:text-amber-400 transition-colors relative group"
                >
                  <span className="flex items-center">
                    <span className="mr-2 text-amber-500">{link.icon}</span>
                    {link.name}
                  </span>
                  <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/wishlist" className="relative p-2 hidden md:block">
                <FiHeart className="text-xl" />
                {wishlistItems.length > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-amber-600 text-xs w-5 h-5 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </Link>
            </motion.div>
            <CartDropdown />
            
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/profile" className="flex items-center bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <FiUser className="mr-2" />
                    {user.name}
                  </Link>
                </motion.div>
                <motion.button 
                  onClick={handleLogout}
                  className="flex items-center text-amber-400 hover:text-amber-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiLogOut className="mr-1" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="hidden md:flex items-center bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <FiKey className="mr-2" />
                  Login
                </Link>
              </motion.div>
            )}
            
            <motion.button 
              className="lg:hidden text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden bg-[#2D1B0E] mt-4 py-4 px-4 border-t border-amber-900/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link 
                    key={index} 
                    to={link.to} 
                    className="font-medium hover:text-amber-400 transition-colors py-2 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3 text-amber-500">{link.icon}</span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              {user ? (
                <div className="pt-4 border-t border-amber-900/40 space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Link 
                      to="/wishlist" 
                      className="flex items-center justify-center space-x-2 px-4 py-3 text-amber-100 hover:bg-amber-600/20 rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiHeart />
                      <span>Wishlist</span>
                      {wishlistItems.length > 0 && (
                        <span className="bg-amber-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {wishlistItems.length}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <Link 
                      to="/profile" 
                      className="flex items-center justify-center space-x-2 px-4 py-3 text-amber-100 hover:bg-amber-600/20 rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser />
                      <span>Profile</span>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  >
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-3 text-amber-100 hover:bg-amber-600/20 rounded-xl w-full"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiKey className="mr-2" />
                    Login
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;