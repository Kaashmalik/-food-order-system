import React, { useState, useContext, useEffect } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext.jsx';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, setError } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(credentials);
    if (result.success) {
      navigate('/');
    }
  };

  // Clear error when component unmounts or when user starts typing
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const handleInputChange = (e) => {
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
    handleChange(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
      <div className="max-w-md w-full bg-[#2D1B0E]/50 rounded-2xl border border-amber-900/30 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto bg-amber-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FaUser className="text-amber-400 text-2xl" />
          </div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-amber-100/80 mt-2">Sign in to your account</p>
        </div>

        {/* Display specific error messages */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Email Address</label>
            <div className="relative">
              <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-amber-400">
                <FaUser />
              </div>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
                className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 pl-10 pr-4 py-3"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Password</label>
            <div className="relative">
              <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-amber-400">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
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

          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="rounded bg-[#2D1B0E] border-amber-900/30 text-amber-600 focus:ring-amber-600" />
              <span className="ml-2 text-amber-100/80">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-amber-400 hover:text-amber-300 transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-amber-100/80">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-900/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#2D1B0E] text-amber-100/80">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-amber-900/30 rounded-md shadow-sm bg-[#2D1B0E] text-sm font-medium text-amber-100/80 hover:bg-amber-600/20">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
              </svg>
              <span className="ml-2">Google</span>
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-amber-900/30 rounded-md shadow-sm bg-[#2D1B0E] text-sm font-medium text-amber-100/80 hover:bg-amber-600/20">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="ml-2">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;