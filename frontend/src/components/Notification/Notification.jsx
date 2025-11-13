import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaExclamation, FaInfo, FaTimes } from 'react-icons/fa';

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  // Don't render if there's no message
  if (!message) {
    return null;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500';
      case 'error':
        return 'bg-red-600 border-red-500';
      case 'warning':
        return 'bg-yellow-600 border-yellow-500';
      default:
        return 'bg-blue-600 border-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-white" />;
      case 'error':
        return <FaExclamation className="text-white" />;
      case 'warning':
        return <FaExclamation className="text-white" />;
      default:
        return <FaInfo className="text-white" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg border shadow-lg ${getTypeStyles()}`}
    >
      <div className="mr-3 text-lg">
        {getIcon()}
      </div>
      <span className="text-white font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        <FaTimes />
      </button>
    </motion.div>
  );
};

export default Notification;