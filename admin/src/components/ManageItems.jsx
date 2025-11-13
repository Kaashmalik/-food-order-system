import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';

const ManageItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Use the admin endpoint that requires authentication
      const res = await axios.get('http://localhost:5001/api/v1/menu/admin', config);
      setMenuItems(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load menu items');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        await axios.delete(`http://localhost:5001/api/v1/menu/${id}`, config);
        // Remove item from state
        setMenuItems(menuItems.filter(item => item._id !== id));
      } catch (err) {
        alert(err.response?.data?.error?.message || 'Failed to delete menu item');
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 px-4 flex justify-center items-center">
        <div className="text-amber-400 text-xl">Loading menu items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-8">
          <h1 className="text-3xl font-bold mb-8">Manage Menu Items</h1>
          
          {menuItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-amber-100/80 text-xl">No menu items found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-amber-900/30">
                    <th className="text-left py-3 px-4">Image</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Rating</th>
                    <th className="text-left py-3 px-4">Hearts</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item._id} className="border-b border-amber-900/30 hover:bg-[#3c2a21]/30">
                      <td className="py-3 px-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{item.name}</td>
                      <td className="py-3 px-4 capitalize">{item.category}</td>
                      <td className="py-3 px-4">₹{item.price}</td>
                      <td className="py-3 px-4">
                        <span className="flex items-center">
                          <FaStar className="text-amber-400 mr-1" />
                          {item.rating}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.isPopular && (
                            <span className="bg-amber-900/30 text-amber-400 text-xs px-2 py-1 rounded">
                              Popular
                            </span>
                          )}
                          {item.isBestSeller && (
                            <span className="bg-red-900/30 text-red-400 text-xs px-2 py-1 rounded">
                              Best Seller
                            </span>
                          )}
                          {item.isSpecial && (
                            <span className="bg-purple-900/30 text-purple-400 text-xs px-2 py-1 rounded">
                              Special
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FaTrash />
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

export default ManageItems;