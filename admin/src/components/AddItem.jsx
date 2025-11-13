import React, { useState } from 'react';
import axios from 'axios';
import { analyzeFoodImage } from '../services/adminService';

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'appetizer',
    image: null,
    isPopular: false,
    isBestSeller: false,
    isSpecial: false,
    rating: 0
  });

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const handleImageLoad = (imageUrl) => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = imageUrl;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

  // New function to analyze image with Gemini AI
  const analyzeImage = async (imageFile) => {
    setAnalyzing(true);
    setError('');
    
    try {
      console.log('Analyzing image with Gemini AI:', imageFile.name);
      const res = await analyzeFoodImage(imageFile);
      console.log('Analysis response:', res);
      
      // Update form data with AI analysis results (only name, category, and description)
      const analysisData = res.data;
      setFormData(prev => ({
        ...prev,
        name: analysisData.foodName,
        description: analysisData.description,
        category: analysisData.category
        // Note: We're not updating price, rating, or boolean flags (isPopular, isBestSeller, isSpecial)
        // These should be set manually by the admin
      }));
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze image');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Upload image first
      let imageUrl = '';
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      // Create menu item data
      const menuItemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: imageUrl,
        isPopular: formData.isPopular,
        isBestSeller: formData.isBestSeller,
        isSpecial: formData.isSpecial,
        rating: parseFloat(formData.rating)
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.post('http://localhost:5001/api/v1/menu', menuItemData, config);
      
      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'appetizer',
        image: null,
        isPopular: false,
        isBestSeller: false,
        isSpecial: false,
        rating: 0
      });
      setImagePreview(null);
      setImageDimensions({ width: 0, height: 0 });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to add menu item');
      console.error('Add item error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-8">
          <h1 className="text-3xl font-bold mb-8">Add New Menu Item</h1>
          
          {success && (
            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-6">
              Menu item added successfully!
            </div>
          )}
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
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
                <label className="block mb-2 font-medium">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg bg-[#3c2a21] text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                >
                  <option value="appetizer">Appetizer</option>
                  <option value="main-course">Main Course</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                  <option value="special">Special</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
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
                {imagePreview && (
                  <div className="mt-4">
                    <div className="border-2 border-amber-700 rounded-lg p-2 inline-block">
                      <img 
                        src={imagePreview} 
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
                
                {/* New Analyze with AI button */}
                {formData.image && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => analyzeImage(formData.image)}
                      disabled={analyzing || loading}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                      {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
                    {analyzing && (
                      <div className="mt-2 text-sm text-amber-400">
                        Analyzing image with Gemini AI...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleInputChange}
                  className="rounded bg-[#3c2a21] border-amber-900/30 text-amber-600 focus:ring-amber-600 mr-2"
                />
                <span>Popular Item</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleInputChange}
                  className="rounded bg-[#3c2a21] border-amber-900/30 text-amber-600 focus:ring-amber-600 mr-2"
                />
                <span>Best Seller</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isSpecial"
                  checked={formData.isSpecial}
                  onChange={handleInputChange}
                  className="rounded bg-[#3c2a21] border-amber-900/30 text-amber-600 focus:ring-amber-600 mr-2"
                />
                <span>Special Item</span>
              </label>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add To Menu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;