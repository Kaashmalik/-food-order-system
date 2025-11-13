import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-400" />;
      case 'error':
        return <FaExclamationCircle className="text-red-400" />;
      case 'info':
        return <FaInfoCircle className="text-blue-400" />;
      default:
        return <FaInfoCircle className="text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/30 border-green-700';
      case 'error':
        return 'bg-red-900/30 border-red-700';
      case 'info':
        return 'bg-blue-900/30 border-blue-700';
      default:
        return 'bg-blue-900/30 border-blue-700';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${getBackgroundColor()} text-white shadow-lg max-w-md`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={onClose}
            className="text-amber-100 hover:text-white focus:outline-none"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;