import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin } from '../services/adminService';
import Notification from './Notification';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear notification when user starts typing
    if (notification) {
      setNotification(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      const res = await loginAdmin(formData.email, formData.password);
      
      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      setNotification({
        message: err.message || 'Login failed',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear notification when component unmounts
  useEffect(() => {
    return () => {
      setNotification(null);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a120b] to-[#3c2a21] px-4">
      <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-8 w-full max-w-md">
        {notification && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">Admin Login</h1>
          <p className="text-amber-100/80">Sign in to access admin panel</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-amber-100/80">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-amber-500 hover:text-amber-400">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;