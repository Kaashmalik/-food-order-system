import React, { useState, useContext } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext.jsx';
import Notification from '../Notification/Notification';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const { register, loading } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setNotification({
        message: 'Passwords do not match!',
        type: 'error'
      });
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return;
    }
    
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...userDataToSend } = userData;
    
    const result = await register(userDataToSend);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="max-w-md w-full bg-[#2D1B0E]/50 rounded-2xl border border-amber-900/30 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto bg-amber-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FaUser className="text-amber-400 text-2xl" />
          </div>
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-amber-100/80 mt-2">Join our foodie community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Full Name</label>
            <div className="relative">
              <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-amber-400">
                <FaUser />
              </div>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 pl-10 pr-4 py-3"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Email Address</label>
            <div className="relative">
              <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-amber-400">
                <FaEnvelope />
              </div>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 pl-10 pr-4 py-3"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Phone Number</label>
            <div className="relative">
              <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-amber-400">
                <FaPhone />
              </div>
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                placeholder="+1 (123) 456-7890"
                required
                className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 pl-10 pr-4 py-3"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Password</label>
            <div className="relative">
              <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-amber-400">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 pl-10 pr-12 py-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 transform -translate-y-1/2 right-3 text-amber-400 hover:text-amber-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Confirm Password</label>
            <div className="relative">
              <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-amber-400">
                <FaLock />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 pl-10 pr-12 py-3"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 transform -translate-y-1/2 right-3 text-amber-400 hover:text-amber-300"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <input 
              type="checkbox" 
              id="terms" 
              className="rounded bg-[#2D1B0E] border-amber-900/30 text-amber-600 focus:ring-amber-600" 
              required 
            />
            <label htmlFor="terms" className="ml-2 text-amber-100/80">
              I agree to the <Link to="/terms" className="text-amber-400 hover:text-amber-300">Terms of Service</Link> and <Link to="/privacy" className="text-amber-400 hover:text-amber-300">Privacy Policy</Link>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-amber-100/80">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;