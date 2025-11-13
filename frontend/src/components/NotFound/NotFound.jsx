import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto bg-amber-900/30 p-6 rounded-full w-24 h-24 flex items-center justify-center mb-6">
          <FaUtensils className="text-amber-400 text-4xl" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-amber-100/80 mb-8 text-lg">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <Link 
            to="/menu" 
            className="bg-transparent border-2 border-amber-600 text-amber-400 hover:bg-amber-600/20 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;