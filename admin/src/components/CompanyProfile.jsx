import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    storyImage: '',
    storyContent: '',
    founder: {
      name: '',
      role: '',
      image: '',
      bio: ''
    },
    stats: {
      restaurants: '',
      deliveryProfessionals: '',
      citiesServed: '',
      yearsOfService: ''
    },
    features: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load existing company profile data
  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.get('http://localhost:5001/api/v1/company-profile', config);
      
      // Set form data with existing profile data
      setFormData({
        storyImage: res.data.data.storyImage || '',
        storyContent: res.data.data.storyContent || '',
        founder: {
          name: res.data.data.founder?.name || '',
          role: res.data.data.founder?.role || '',
          image: res.data.data.founder?.image || '',
          bio: res.data.data.founder?.bio || ''
        },
        stats: {
          restaurants: res.data.data.stats?.restaurants || '',
          deliveryProfessionals: res.data.data.stats?.deliveryProfessionals || '',
          citiesServed: res.data.data.stats?.citiesServed || '',
          yearsOfService: res.data.data.stats?.yearsOfService || ''
        },
        features: res.data.data.features || [
          { title: '', description: '' },
          { title: '', description: '' },
          { title: '', description: '' }
        ]
      });
    } catch (err) {
      console.error('Failed to load company profile', err);
      setError('Failed to load company profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.startsWith('founder.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        founder: {
          ...prev.founder,
          [field]: value
        }
      }));
    } else if (name.startsWith('stats.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
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

  const handleImageChange = async (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      try {
        console.log('Selected file:', file.name, file.size, file.type);
        const imageUrl = await uploadImage(file);
      
        if (imageType === 'story') {
          setFormData(prev => ({
            ...prev,
            storyImage: imageUrl
          }));
        } else if (imageType === 'founder') {
          setFormData(prev => ({
            ...prev,
            founder: {
              ...prev.founder,
              image: imageUrl
            }
          }));
        }
      } catch (err) {
        console.error('Failed to upload image:', err);
        setError('Failed to upload image: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      // Prepare data for submission
      const submitData = {
        storyImage: formData.storyImage,
        storyContent: formData.storyContent,
        founder: formData.founder,
        stats: {
          restaurants: parseInt(formData.stats.restaurants) || 0,
          deliveryProfessionals: parseInt(formData.stats.deliveryProfessionals) || 0,
          citiesServed: parseInt(formData.stats.citiesServed) || 0,
          yearsOfService: parseInt(formData.stats.yearsOfService) || 0
        },
        features: formData.features
      };

      await axios.put('http://localhost:5001/api/v1/company-profile', submitData, config);
      
      setSuccess('Company profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update company profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-8">
          <h1 className="text-3xl font-bold mb-8">Company Profile</h1>
          
          {success && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-700 text-green-400 rounded-lg">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 text-red-400 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Our Story Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Our Story</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block mb-2 font-medium">Story Image</label>
                  <div className="relative">
                    <div className="border-2 border-amber-700 rounded-lg p-2 inline-block mb-4">
                      <img 
                        src={formData.storyImage || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} 
                        alt="Our Story" 
                        className="max-w-full h-auto rounded"
                        style={{ 
                          width: '100%',
                          height: 'auto'
                        }}
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'story')}
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Story Content</label>
                  <textarea
                    name="storyContent"
                    value={formData.storyContent}
                    onChange={handleInputChange}
                    rows="8"
                    className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                  />
                </div>
              </div>
            </div>
            
            {/* Founder Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Founder Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Founder Image</label>
                  <div className="relative">
                    <div className="border-2 border-amber-700 rounded-lg p-2 inline-block mb-4">
                      <img 
                        src={formData.founder.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} 
                        alt={formData.founder.name} 
                        className="max-w-full h-auto rounded"
                        style={{ 
                          width: '100%',
                          height: 'auto'
                        }}
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'founder')}
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Founder Name</label>
                    <input
                      type="text"
                      name="founder.name"
                      value={formData.founder.name}
                      onChange={handleInputChange}
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block mb-2 font-medium">Founder Role</label>
                    <input
                      type="text"
                      name="founder.role"
                      value={formData.founder.role}
                      onChange={handleInputChange}
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">Founder Bio</label>
                    <textarea
                      name="founder.bio"
                      value={formData.founder.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Company Stats</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Restaurants</label>
                  <input
                    type="number"
                    name="stats.restaurants"
                    value={formData.stats.restaurants}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Delivery Professionals</label>
                  <input
                    type="number"
                    name="stats.deliveryProfessionals"
                    value={formData.stats.deliveryProfessionals}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Cities Served</label>
                  <input
                    type="number"
                    name="stats.citiesServed"
                    value={formData.stats.citiesServed}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Years of Service</label>
                  <input
                    type="number"
                    name="stats.yearsOfService"
                    value={formData.stats.yearsOfService}
                    onChange={handleInputChange}
                    className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                  />
                </div>
              </div>
            </div>
            
            {/* Features Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Key Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {formData.features.map((feature, index) => (
                  <div key={index}>
                    <label className="block mb-2 font-medium">Feature {index + 1} Title</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3 mb-4"
                    />
                    <label className="block mb-2 font-medium">Feature {index + 1} Description</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      rows="3"
                      className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;