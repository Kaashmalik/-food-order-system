import React, { useState, useEffect } from 'react';
import { getPendingAdmins, updateAdminStatus } from '../services/adminService';
import Notification from './Notification';

const AdminApproval = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadPendingAdmins();
  }, []);

  const loadPendingAdmins = async () => {
    try {
      setLoading(true);
      const res = await getPendingAdmins();
      setAdmins(res.data);
    } catch (err) {
      setNotification({
        message: 'Failed to load pending admins',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (adminId, status) => {
    try {
      setUpdatingId(adminId);
      await updateAdminStatus(adminId, status);
      
      // Update the local state
      setAdmins(admins.map(admin => 
        admin._id === adminId ? { ...admin, status } : admin
      ));
      
      setNotification({
        message: `Admin ${status} successfully`,
        type: 'success'
      });
    } catch (err) {
      setNotification({
        message: `Failed to ${status} admin`,
        type: 'error'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a120b] to-[#3c2a21]">
        <div className="text-amber-400 text-xl">Loading pending admins...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a120b] to-[#3c2a21] py-8">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-amber-400 mb-2">Admin Approval</h1>
            <p className="text-amber-100/80">Review and approve/reject pending admin registrations</p>
          </div>
          
          {admins.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-amber-100/80 text-lg">No pending admin registrations</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-amber-900/30">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Restaurant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Manager</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/30">
                  {admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-[#3c2a21]/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-amber-100">{admin.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-amber-100/80">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-amber-100/80">{admin.restaurantName}</div>
                        <div className="text-xs text-amber-100/60">{admin.restaurantAddress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-amber-100/80">{admin.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-amber-100/80">{admin.age}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-amber-100/80">{admin.restaurantManagerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(admin._id, 'approved')}
                            disabled={updatingId === admin._id}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50"
                          >
                            {updatingId === admin._id ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(admin._id, 'rejected')}
                            disabled={updatingId === admin._id}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
                          >
                            {updatingId === admin._id ? 'Rejecting...' : 'Reject'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApproval;