import React, { useState, useEffect } from 'react';
import { getAllAdmins, updateAdminStatus } from '../services/adminService';
import Notification from './Notification';

const SuperAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const res = await getAllAdmins();
      setAdmins(res.data);
      setLoading(false);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load admins',
        type: 'error'
      });
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (adminId, status) => {
    try {
      await updateAdminStatus(adminId, status);
      
      // Update local state
      setAdmins(admins.map(admin => 
        admin._id === adminId ? { ...admin, status } : admin
      ));
      
      setNotification({
        message: `Admin ${status} successfully`,
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: err.message || `Failed to ${status} admin`,
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-amber-400">Loading admins...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6">
        <h1 className="text-3xl font-bold text-amber-400 mb-8">Super Admin Dashboard</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-900/30">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-100/80 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-100/80 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-100/80 uppercase tracking-wider">Restaurant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-100/80 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-100/80 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-100/80 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/30">
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{admin.name}</div>
                    <div className="text-sm text-amber-100/80">{admin.restaurantManagerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{admin.restaurantName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{admin.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.status === 'approved' 
                        ? 'bg-green-900/30 text-green-400' 
                        : admin.status === 'pending' 
                          ? 'bg-yellow-900/30 text-yellow-400' 
                          : 'bg-red-900/30 text-red-400'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {admin.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(admin._id, 'approved')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(admin._id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {admin.status === 'approved' && (
                      <button
                        onClick={() => handleStatusUpdate(admin._id, 'rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Reject
                      </button>
                    )}
                    {admin.status === 'rejected' && (
                      <button
                        onClick={() => handleStatusUpdate(admin._id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {admins.length === 0 && (
          <div className="text-center py-8 text-amber-100/80">
            No admin requests found
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;