import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-[#2D1B0E]/50 p-6 rounded-xl border border-amber-900/30">
      <div className="flex items-center mb-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 rounded-full" />
        <div className="ml-4">
          <h4 className="font-bold">{review.name}</h4>
          <p className="text-amber-400 text-sm">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={i < review.rating ? "text-amber-400" : "text-amber-900/30"} 
          />
        ))}
      </div>
      
      <p className="text-amber-100/80 italic">"{review.comment}"</p>
    </div>
  );
};

export default ReviewCard;