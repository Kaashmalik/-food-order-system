import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAdmin } from '../services/adminService';
import Notification from './Notification';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    restaurantName: '',
    restaurantAddress: '',
    age: '',
    restaurantManagerName: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const { 
    name, 
    email, 
    password, 
    phone, 
    restaurantName, 
    restaurantAddress, 
    age, 
    restaurantManagerName 
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      const res = await registerAdmin(formData);
      
      setNotification({
        message: 'Registration successful! Please wait for approval from super-admin.',
        type: 'success'
      });
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setNotification({
        message: err.message || 'Registration failed',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-amber-400 mb-2">Admin Registration</h1>
          <p className="text-amber-100/80">Register for admin access to the food ordering system</p>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={onChange}
              required
              className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={restaurantName}
              onChange={onChange}
              required
              className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
              placeholder="Enter restaurant name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Restaurant Address</label>
            <textarea
              name="restaurantAddress"
              value={restaurantAddress}
              onChange={onChange}
              required
              rows="3"
              className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
              placeholder="Enter restaurant address"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Age</label>
            <input
              type="number"
              name="age"
              value={age}
              onChange={onChange}
              required
              min="18"
              max="100"
              className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
              placeholder="Enter your age"
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium">Restaurant Manager Name</label>
            <input
              type="text"
              name="restaurantManagerName"
              value={restaurantManagerName}
              onChange={onChange}
              required
              className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
              placeholder="Enter manager name"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-amber-100/80">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-amber-500 hover:text-amber-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;