import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import About from './components/About/About';
import Menu from './components/Menu/Menu';
import Cart from './components/Cart/Cart';
import Contact from './components/Contact/Contact';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import MenuItemDetail from './components/MenuItemDetail/MenuItemDetail';
import Profile from './components/Profile/Profile';
import Checkout from './components/Checkout/Checkout';
import StripeCheckout from './components/StripeCheckout/StripeCheckout';
import OrderConfirmation from './components/Order/OrderConfirmation';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Wishlist from './components/Wishlist/Wishlist';
import NotFound from './components/NotFound/NotFound';
import { AppProvider } from './context/AppContext.jsx';

// Create a wrapper component for routing
const MainApp = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:id" element={<MenuItemDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/stripe-checkout" element={<StripeCheckout />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

// Render the app
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
);
