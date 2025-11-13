import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AddItem from './components/AddItem';
import ManageItems from './components/ManageItems';
import Orders from './components/Orders';
import ManageChefs from './components/ManageChefs';
import Profile from './components/Profile';
import AdminApproval from './components/AdminApproval';
import CompanyProfile from './components/CompanyProfile';
import ContactMessages from './components/ContactMessages';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#1a120b] to-[#3c2a21] text-amber-100">
        <Routes>
          {/* Public routes - no navbar */}
          <Route path="/login" element={
            <div className="min-h-screen bg-gradient-to-br from-[#1a120b] to-[#3c2a21]">
              <Login />
            </div>
          } />
          <Route path="/register" element={
            <div className="min-h-screen bg-gradient-to-br from-[#1a120b] to-[#3c2a21]">
              <Register />
            </div>
          } />
          
          {/* Protected routes - with navbar */}
          <Route path="/" element={
            <>
              <Navbar />
              <ProtectedRoute><AddItem /></ProtectedRoute>
            </>
          } />
          <Route path="/manage-items" element={
            <>
              <Navbar />
              <ProtectedRoute><ManageItems /></ProtectedRoute>
            </>
          } />
          <Route path="/orders" element={
            <>
              <Navbar />
              <ProtectedRoute><Orders /></ProtectedRoute>
            </>
          } />
          <Route path="/manage-chefs" element={
            <>
              <Navbar />
              <ProtectedRoute><ManageChefs /></ProtectedRoute>
            </>
          } />
          <Route path="/contact-messages" element={
            <>
              <Navbar />
              <ProtectedRoute><ContactMessages /></ProtectedRoute>
            </>
          } />
          <Route path="/profile" element={
            <>
              <Navbar />
              <ProtectedRoute><Profile /></ProtectedRoute>
            </>
          } />
          <Route path="/admin-approval" element={
            <>
              <Navbar />
              <ProtectedRoute requiredRole="super-admin"><AdminApproval /></ProtectedRoute>
            </>
          } />
          <Route path="/company-profile" element={
            <>
              <Navbar />
              <ProtectedRoute requiredRole="super-admin"><CompanyProfile /></ProtectedRoute>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;