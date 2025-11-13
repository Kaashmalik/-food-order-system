import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAdmin } from '../services/adminService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Verify token with backend
        const res = await getCurrentAdmin();
        
        // Check if specific role is required
        if (requiredRole && res.data.role !== requiredRole) {
          // Redirect to appropriate page based on role
          if (res.data.role === 'admin') {
            navigate('/');
          } else {
            navigate('/login');
          }
          return;
        }
        
        setLoading(false);
      } catch (error) {
        // Token is invalid, redirect to login
        localStorage.removeItem('adminToken');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a120b] to-[#3c2a21]">
        <div className="text-amber-400 text-xl">Loading...</div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;