import React from 'react';
import { motion } from 'framer-motion';
import { FaPercent, FaMotorcycle, FaGift } from 'react-icons/fa';

const PromotionalBanner = () => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl p-6 shadow-xl overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div 
          className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="flex items-center space-x-4 bg-black/20 p-4 rounded-xl"
          whileHover={{ scale: 1.03 }}
        >
          <div className="bg-white text-amber-600 p-3 rounded-full">
            <FaPercent className="text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Special Offers</h3>
            <p className="text-sm">Up to 50% off on selected items</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-4 bg-black/20 p-4 rounded-xl"
          whileHover={{ scale: 1.03 }}
        >
          <div className="bg-white text-amber-600 p-3 rounded-full">
            <FaMotorcycle className="text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Free Delivery</h3>
            <p className="text-sm">On orders above ₹499</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-4 bg-black/20 p-4 rounded-xl"
          whileHover={{ scale: 1.03 }}
        >
          <div className="bg-white text-amber-600 p-3 rounded-full">
            <FaGift className="text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Loyalty Rewards</h3>
            <p className="text-sm">Earn points with every order</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PromotionalBanner;