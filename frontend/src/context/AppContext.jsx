import React, { createContext, useState, useEffect } from 'react';
import API from '../config/api';
import { getWishlist, addToWishlist as addWishlistItem, removeFromWishlist as removeWishlistItem } from '../services/wishlistService';

// Create context
export const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    }
  }, []);

  // Load user data
  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/me');
      setUser(res.data.data);
      setLoading(false);
      
      // Load wishlist if user is authenticated
      if (res.data.data) {
        loadWishlist();
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load user');
      setLoading(false);
    }
  };

  // Load wishlist
  const loadWishlist = async () => {
    try {
      const res = await getWishlist();
      setWishlistItems(res.data);
    } catch (err) {
      //setError(err.message);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.data);
      setWishlistItems([]);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
      setLoading(false);
      return { success: false, error: err.response?.data?.error?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/login', userData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.data);
      setLoading(false);
      
      // Load wishlist after login
      loadWishlist();
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || 'Login failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCartItems([]);
    setWishlistItems([]);
  };

  // Add item to cart
  const addToCart = (item, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Update quantity
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        // Add new item
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Update item quantity
  const updateCartItemQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Add item to wishlist
  const addToWishlist = async (menuItemId) => {
    try {
      const res = await addWishlistItem(menuItemId);
      setWishlistItems(res.data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (menuItemId) => {
    try {
      const res = await removeWishlistItem(menuItemId);
      setWishlistItems(res.data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Context values
  const contextValue = {
    user,
    cartItems,
    wishlistItems,
    loading,
    error,
    setError,
    register,
    login,
    logout,
    loadUser,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartTotal,
    getCartItemCount,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    loadWishlist
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};