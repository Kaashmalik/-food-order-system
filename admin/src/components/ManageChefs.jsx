import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ManageChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingChef, setEditingChef] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: null,
    social: {
      twitter: '',
      instagram: '',
      facebook: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    loadChefs();
  }, []);

  const loadChefs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Use the admin endpoint that requires authentication
      const res = await axios.get('http://localhost:5001/api/v1/chefs/admin', config);
      setChefs(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load chefs');
      setLoading(false);
    }
  };

  const handleImageLoad = (imageUrl) => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = imageUrl;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested social fields
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        handleImageLoad(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (imageFile) => {
    // Check file size before upload (20MB limit)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (imageFile.size > maxSize) {
      throw new Error(`File size too large. Maximum size is 20MB. Your file is ${(imageFile.size / (1024 * 1024)).toFixed(2)}MB.`);
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Uploading image:', imageFile.name);
      const res = await axios.post('http://localhost:5001/api/v1/upload', formData, config);
      console.log('Upload response:', res.data);
      return res.data.data;
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response) {
        // Server responded with error status
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        throw new Error(error.response.data?.error?.message || 'Upload failed');
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Server may have crashed.');
      } else {
        // Something else happened
        console.error('Error message:', error.message);
        throw new Error(error.message || 'Upload failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      // Handle image upload
      let imageUrl = '';
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      } else if (editingChef) {
        // Keep existing image if not uploading a new one
        imageUrl = editingChef.image;
      }

      // Prepare chef data
      const chefData = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        image: imageUrl,
        social: formData.social
      };

      if (editingChef) {
        // Update existing chef
        await axios.put(`http://localhost:5001/api/v1/chefs/${editingChef._id}`, chefData, config);
      } else {
        // Create new chef
        await axios.post('http://localhost:5001/api/v1/chefs', chefData, config);
      }

      // Reset form and refresh data
      setFormData({
        name: '',
        role: '',
        bio: '',
        image: null,
        social: {
          twitter: '',
          instagram: '',
          facebook: '',
          linkedin: ''
        }
      });
      setImagePreview(null);
      setImageDimensions({ width: 0, height: 0 });
      setEditingChef(null);
      setShowForm(false);
      loadChefs();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save chef');
    }
  };

  const handleEdit = (chef) => {
    setFormData({
      name: chef.name,
      role: chef.role,
      bio: chef.bio,
      image: null, // We don't set the file object here, just keep it null
      social: {
        twitter: chef.social?.twitter || '',
        instagram: chef.social?.instagram || '',
        facebook: chef.social?.facebook || '',
        linkedin: chef.social?.linkedin || ''
      }
    });
    setImagePreview(chef.image); // Set preview to existing image
    handleImageLoad(chef.image);
    setEditingChef(chef);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this chef?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        await axios.delete(`http://localhost:5001/api/v1/chefs/${id}`, config);
        // Remove chef from state
        setChefs(chefs.filter(chef => chef._id !== id));
      } catch (err) {
        alert(err.response?.data?.error?.message || 'Failed to delete chef');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      image: null,
      social: {
        twitter: '',
        instagram: '',
        facebook: '',
        linkedin: ''
      }
    });
    setImagePreview(null);
    setImageDimensions({ width: 0, height: 0 });
    setEditingChef(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 px-4 flex justify-center items-center">
        <div className="text-amber-400 text-xl">Loading chefs...</div>
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Chefs</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              {showForm ? 'Cancel' : 'Add New Chef'}
            </button>
          </div>

          {showForm && (
            <div className="mb-8 bg-[#3c2a21]/50 rounded-xl p-6 border border-amber-900/30">
              <h2 className="text-2xl font-bold mb-6">
                {editingChef ? 'Edit Chef' : 'Add New Chef'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block mb-2 font-medium">Name</label>
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
                    <label className="block mb-2 font-medium">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block mb-2 font-medium">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block mb-2 font-medium">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
                    />
                    {(imagePreview || (editingChef && editingChef.image)) && (
                      <div className="mt-4">
                        <div className="border-2 border-amber-700 rounded-lg p-2 inline-block">
                          <img 
                            src={imagePreview || editingChef.image} 
                            alt="Preview" 
                            className="max-w-full h-auto rounded"
                            style={{ 
                              width: imageDimensions.width > 0 ? 'auto' : '128px',
                              height: imageDimensions.width > 0 ? 'auto' : '128px'
                            }}
                          />
                        </div>
                        {imageDimensions.width > 0 && (
                          <div className="mt-2 text-sm text-amber-400">
                            Dimensions: {imageDimensions.width} × {imageDimensions.height} pixels
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">Twitter URL</label>
                    <input
                      type="text"
                      name="social.twitter"
                      value={formData.social.twitter}
                      onChange={handleInputChange}
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">Instagram URL</label>
                    <input
                      type="text"
                      name="social.instagram"
                      value={formData.social.instagram}
                      onChange={handleInputChange}
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">Facebook URL</label>
                    <input
                      type="text"
                      name="social.facebook"
                      value={formData.social.facebook}
                      onChange={handleInputChange}
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">LinkedIn URL</label>
                    <input
                      type="text"
                      name="social.linkedin"
                      value={formData.social.linkedin}
                      onChange={handleInputChange}
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    {editingChef ? 'Update Chef' : 'Add Chef'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {chefs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-amber-100/80 text-xl">No chefs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-amber-900/30">
                    <th className="text-left py-3 px-4">Image</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Bio</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chefs.map((chef) => (
                    <tr key={chef._id} className="border-b border-amber-900/30 hover:bg-[#3c2a21]/30">
                      <td className="py-3 px-4">
                        {chef.image ? (
                          <div className="relative">
                            <div className="border border-amber-700 rounded-lg p-1 inline-block">
                              <img 
                                src={chef.image} 
                                alt={chef.name} 
                                className="w-12 h-12 object-cover rounded"
                                style={{ 
                                  width: chef.imageDimensions?.width > 0 ? 'auto' : '48px',
                                  height: chef.imageDimensions?.width > 0 ? 'auto' : '48px'
                                }}
                              />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs px-1 rounded">
                              {chef.imageDimensions?.width || 'N/A'}×{chef.imageDimensions?.height || 'N/A'}
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-amber-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-amber-400">No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">{chef.name}</td>
                      <td className="py-3 px-4">{chef.role}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{chef.bio}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(chef)}
                            className="text-amber-400 hover:text-amber-300"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(chef._id)}
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

export default ManageChefs;