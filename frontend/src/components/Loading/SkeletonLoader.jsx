import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-5 animate-pulse">
            <div className="bg-[#3c2a21] h-48 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="bg-[#3c2a21] h-6 rounded w-3/4"></div>
              <div className="bg-[#3c2a21] h-4 rounded w-full"></div>
              <div className="bg-[#3c2a21] h-4 rounded w-5/6"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="bg-[#3c2a21] h-4 rounded w-1/4"></div>
                <div className="bg-[#3c2a21] h-8 rounded w-24"></div>
              </div>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 p-5 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="bg-[#3c2a21] h-16 w-16 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-[#3c2a21] h-4 rounded w-1/3"></div>
                <div className="bg-[#3c2a21] h-3 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="animate-pulse">
            <div className="bg-[#3c2a21] h-6 rounded w-3/4 mb-3"></div>
            <div className="bg-[#3c2a21] h-4 rounded w-full mb-2"></div>
            <div className="bg-[#3c2a21] h-4 rounded w-5/6"></div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-6 last:mb-0">
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;