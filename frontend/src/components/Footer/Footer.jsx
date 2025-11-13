import React from 'react';
import { FaRegEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { GiChefToque } from 'react-icons/gi';
import { socialIcons } from '../../assets/dummydata';
import { motion } from 'framer-motion';

const Footer = () => {
  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'Menu', link: '/menu' },
    { name: 'About Us', link: '/about' },
    { name: 'Contact', link: '/contact' },
    { name: 'FAQ', link: '/faq' },
    { name: 'Privacy Policy', link: '/privacy' },
  ];

  return (
    <motion.footer 
      className="bg-[#2D1B0E] pt-16 pb-8 px-4 border-t-4 border-amber-900/40"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <GiChefToque className="text-2xl text-amber-500" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Food-Order-Easy
              </h3>
            </div>
            <p className="text-amber-100/80 mb-6">
              Delivering delicious meals with passion and quality since 2024. Experience the best culinary delights from our curated menu.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a 
                    key={index} 
                    href={social.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 transition-colors text-xl"
                    style={{color: social.color}}
                    whileHover={{ y: -5, scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {navItems.map((item, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <a href={item.link} className="text-amber-100/80 hover:text-amber-400 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></span>
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-amber-100/80">
              <motion.li className="flex items-start" whileHover={{ x: 5 }}>
                <FaRegEnvelope className="text-amber-400 mt-1 mr-3 flex-shrink-0" />
                <span>kaash0542@gmail.com</span>
              </motion.li>
              <motion.li className="flex items-start" whileHover={{ x: 5 }}>
                <FaPhone className="text-amber-400 mt-1 mr-3 flex-shrink-0" />
                <span>+92 303 8111297</span>
              </motion.li>
              <motion.li className="flex items-start" whileHover={{ x: 5 }}>
                <FaMapMarkerAlt className="text-amber-400 mt-1 mr-3 flex-shrink-0" />
                <span>Lahore, Punjab, Pakistan</span>
              </motion.li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-6">Newsletter</h4>
            <p className="text-amber-100/80 mb-4">
              Subscribe to get special offers and updates
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-[#3c2a21] text-amber-50 placeholder-amber-400/70 px-4 py-3 rounded-l-lg outline-none w-full"
              />
              <motion.button 
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-r-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join
              </motion.button>
            </div>
            <p className="text-amber-100/60 text-sm mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-amber-900/40 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-amber-100/60 mb-4 md:mb-0">
              &copy; 2025 Food-Order-Easy. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <motion.a 
                href="#" 
                className="text-amber-100/60 hover:text-amber-400 transition-colors"
                whileHover={{ y: -2 }}
              >
                Terms of Service
              </motion.a>
              <motion.a 
                href="#" 
                className="text-amber-100/60 hover:text-amber-400 transition-colors"
                whileHover={{ y: -2 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                href="#" 
                className="text-amber-100/60 hover:text-amber-400 transition-colors"
                whileHover={{ y: -2 }}
              >
                Accessibility
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;