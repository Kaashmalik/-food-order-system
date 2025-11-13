import React, { useState, useContext, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import { addReview } from '../../services/reviewService';

const AddReviewForm = ({ menuItemId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AppContext);

  console.log('AddReviewForm rendered with menuItemId:', menuItemId);
  console.log('User in AddReviewForm:', user);
  
  // Validate menuItemId
  useEffect(() => {
    if (!menuItemId || menuItemId === 'undefined') {
      console.error('Invalid menu item ID provided to AddReviewForm:', menuItemId);
      setError('Invalid menu item ID. Please refresh the page and try again.');
    }
  }, [menuItemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submitting review for menu item:', menuItemId);
    console.log('User:', user);
    
    // Validate menuItemId again before submission
    if (!menuItemId || menuItemId === 'undefined') {
      setError('Invalid menu item ID. Please refresh the page and try again.');
      return;
    }
    
    if (!user) {
      setError('Please login to submit a review');
      return;
    }
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please enter your review');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const reviewData = {
        rating,
        comment
      };
      
      console.log('Sending review data:', reviewData);
      const res = await addReview(menuItemId, reviewData);
      console.log('Review response:', res);
      
      setSuccess(true);
      setRating(0);
      setComment('');
      
      // Notify parent component that review was added
      if (onReviewAdded) {
        onReviewAdded(res.data);
      }
    } catch (err) {
      console.error('Review submission error:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  console.log('Rendering AddReviewForm - User exists:', !!user);

  if (!user) {
    console.log('User not logged in, showing login prompt');
    return (
      <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6">
        <p className="text-amber-100/80">
          Please <a href="/login" className="text-amber-400 hover:text-amber-300">login</a> to submit a review
        </p>
      </div>
    );
  }

  console.log('Rendering AddReviewForm - Showing form');

  return (
    <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6">
      <h3 className="text-xl font-bold mb-4">Share Your Experience</h3>
      
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg mb-4">
          Thank you for your review! It has been submitted successfully.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Your Rating</label>
          <div className="flex">
            {[...Array(5)].map((_, i) => {
              const ratingValue = i + 1;
              return (
                <button
                  type="button"
                  key={i}
                  className="bg-transparent border-0 outline-none"
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                >
                  <FaStar
                    className="text-2xl"
                    color={ratingValue <= (hover || rating) ? "#f59e0b" : "#3c2a21"}
                  />
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this item..."
            className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
            rows="4"
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;