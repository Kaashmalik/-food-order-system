import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const AddReview = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      onSubmit({ rating, comment });
      setRating(0);
      setComment('');
    }
  };

  return (
    <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-6">
      <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Your Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="text-2xl focus:outline-none"
              >
                {star <= (hover || rating) ? (
                  <FaStar className="text-amber-400" />
                ) : (
                  <FaRegStar className="text-amber-400" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this item..."
            rows="4"
            className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3"
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default AddReview;