import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUtensils, FaList, FaShoppingCart, FaUserAlt, FaSignOutAlt, FaUsers, FaBuilding, FaEnvelope } from 'react-icons/fa';
import { getCurrentAdmin, logoutAdmin } from '../services/adminService';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load admin data
  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (token) {
          const res = await getCurrentAdmin();
          setAdmin(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin', err);
        // If there's an error loading admin data, redirect to login
        localStorage.removeItem('adminToken');
        navigate('/login');
      }
    };

    loadAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      // Always remove token and redirect to login
      localStorage.removeItem('adminToken');
      navigate('/login');
    }
  };

  const navLinks = [
    { name: 'Add Item', to: '/', icon: <FaUtensils /> },
    { name: 'Manage Items', to: '/manage-items', icon: <FaList /> },
    { name: 'Orders', to: '/orders', icon: <FaShoppingCart /> },
    { name: 'Manage Chefs', to: '/manage-chefs', icon: <FaUserAlt /> },
    { name: 'Contact Messages', to: '/contact-messages', icon: <FaEnvelope /> }
  ];

  // Add Admin Approval link for super-admins
  if (admin && admin.role === 'super-admin') {
    navLinks.push({ name: 'Admin Approval', to: '/admin-approval', icon: <FaUsers /> });
    // Add Company Profile link for super-admins to manage "Our Story"
    navLinks.push({ name: 'Company Profile', to: '/company-profile', icon: <FaBuilding /> });
  }

  // Check if admin is logged in
  const isLoggedIn = !!localStorage.getItem('adminToken');

  return (
    <nav className="bg-[#2D1B0E] border-b border-amber-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaUtensils className="text-amber-500 text-xl" />
            <span className="text-xl font-bold text-amber-400">Admin Panel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  location.pathname === link.to
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-100 hover:bg-amber-600/20'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </Link>
            ))}
            
            {/* Profile Icon - only show when logged in */}
            {isLoggedIn && (
              <div className="relative ml-4" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-amber-100 hover:bg-amber-600/20 rounded-full p-1 transition-colors"
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 rounded-full" />
                </button>
                
                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#2D1B0E] border border-amber-900/30 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-amber-900/30">
                        <p className="text-sm font-medium">{admin?.name || 'Admin User'}</p>
                        <p className="text-xs text-amber-100/80">{admin?.email || 'admin@example.com'}</p>
                        {admin?.role && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-600/20 text-amber-300 mt-1">
                            {admin.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                          </span>
                        )}
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-amber-100 hover:bg-amber-600/20"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FaUserAlt className="inline mr-2" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-amber-100 hover:bg-amber-600/20"
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-amber-100 hover:text-amber-300 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                    location.pathname === link.to
                      ? 'bg-amber-600 text-white'
                      : 'text-amber-100 hover:bg-amber-600/20'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
              
              {/* Profile and Logout - only show when logged in */}
              {isLoggedIn && (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-amber-100 hover:bg-amber-600/20 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUserAlt className="mr-2" />
                    My Profile
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-amber-100 hover:bg-amber-600/20 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;