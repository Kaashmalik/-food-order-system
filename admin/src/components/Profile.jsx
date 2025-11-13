import React, { useState, useEffect } from 'react';
import { getCurrentAdmin, updateAdminDetails, updateAdminPassword } from '../services/adminService';
import Notification from './Notification';

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    restaurantName: '',
    restaurantAddress: '',
    age: '',
    restaurantManagerName: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const res = await getCurrentAdmin();
      setAdmin(res.data);
      setFormData({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        restaurantName: res.data.restaurantName,
        restaurantAddress: res.data.restaurantAddress,
        age: res.data.age,
        restaurantManagerName: res.data.restaurantManagerName
      });
      setLoading(false);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load profile data',
        type: 'error'
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setNotification(null);

    try {
      const res = await updateAdminDetails(formData);
      setAdmin(res.data);
      setNotification({
        message: 'Profile updated successfully',
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to update profile',
        type: 'error'
      });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setNotification(null);

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        message: 'New passwords do not match',
        type: 'error'
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setNotification({
        message: 'Password must be at least 6 characters',
        type: 'error'
      });
      return;
    }

    try {
      await updateAdminPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setNotification({
        message: 'Password updated successfully',
        type: 'success'
      });
      
      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to update password',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-amber-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-amber-400">Admin Profile</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'security'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {activeTab === 'profile' ? (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="100"
                  required
                  className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Restaurant Name</label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Restaurant Address</label>
                <textarea
                  name="restaurantAddress"
                  value={formData.restaurantAddress}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Restaurant Manager Name</label>
                <input
                  type="text"
                  name="restaurantManagerName"
                  value={formData.restaurantManagerName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div>
                <span className="text-sm text-gray-400">
                  Account Status: 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    admin.status === 'approved' 
                      ? 'bg-green-900/30 text-green-400' 
                      : admin.status === 'pending' 
                        ? 'bg-yellow-900/30 text-yellow-400' 
                        : 'bg-red-900/30 text-red-400'
                  }`}>
                    {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                  </span>
                </span>
              </div>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-lg font-bold transition-colors"
              >
                Update Profile
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                placeholder="Enter current password"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
                className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                placeholder="Confirm new password"
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-lg font-bold transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;