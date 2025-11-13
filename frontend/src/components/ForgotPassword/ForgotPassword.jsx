import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
      <div className="max-w-md w-full bg-[#2D1B0E]/50 rounded-2xl border border-amber-900/30 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto bg-amber-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FaEnvelope className="text-amber-400 text-2xl" />
          </div>
          
          {isSubmitted ? (
            <>
              <h2 className="text-3xl font-bold mb-4">Check Your Email</h2>
              <p className="text-amber-100/80">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold">Forgot Password?</h2>
              <p className="text-amber-100/80 mt-2">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </>
          )}
        </div>

        {isSubmitted ? (
          <div className="text-center">
            <p className="text-amber-100/80 mb-6">
              Didn't receive the email? Check your spam folder or
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 font-medium">Email Address</label>
              <div className="relative">
                <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-amber-400">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 pl-10 pr-4 py-3"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="flex items-center justify-center text-amber-400 hover:text-amber-300 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;