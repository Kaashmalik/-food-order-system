import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaGithub } from 'react-icons/fa';
import { contactFormFields } from '../../assets/dummydata';
import Notification from '../Notification/Notification';
import { createContactMessage } from '../../services/contactService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send data to backend
      await createContactMessage(formData);
      
      // Show success notification
      setNotification({
        message: 'Thank you for your message! We will get back to you soon.',
        type: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      // Show error notification
      setNotification({
        message: error.message || 'Failed to send message. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Phone & WhatsApp',
      details: ['+92 303 8111297']
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      details: ['kaash0542@gmail.com']
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Address',
      details: ['Lahore, Punjab, Pakistan']
    },
    {
      icon: <FaClock />,
      title: 'Working Hours',
      details: ['24/7 Delivery Service', 'Customer Support: 10AM - 11PM']
    }
  ];

  return (
    <div className="pt-24 pb-16 px-4">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get In <span className="text-amber-400">Touch</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-amber-100/80">
            Have questions or feedback? We'd love to hear from you. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
            
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex">
                  <div className="bg-amber-900/30 p-4 rounded-full mr-6">
                    <div className="text-amber-400 text-2xl">
                      {info.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-amber-100/80 mb-1">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-12 rounded-2xl overflow-hidden border-4 border-amber-900/30">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-80 flex items-center justify-center">
                <p className="text-amber-400 font-bold">Interactive Map</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {[
                  { icon: <FaLinkedin />, color: 'text-blue-700', link: 'https://www.linkedin.com/in/mahammad-aftab' },
                  { icon: <FaGithub />, color: 'text-gray-400', link: 'https://github.com/mahammadaftab' },
                  { icon: <FaInstagram />, color: 'text-pink-500', link: 'https://www.instagram.com/mahammad_aftab_attari/' },
                  { icon: <FaYoutube />, color: 'text-red-600', link: 'https://mahammadaftab.vercel.app/' }
                ].map((social, index) => (
                  <a 
                    key={index} 
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-[#2D1B0E] p-3 rounded-full ${social.color} hover:bg-amber-600/20 transition-colors`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="bg-[#2D1B0E]/50 rounded-2xl border border-amber-900/30 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {contactFormFields.slice(0, 2).map((field) => (
                  <div key={field.name}>
                    <label className="block mb-2 font-medium">{field.label}</label>
                    <div className="relative">
                      <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-amber-400">
                        <field.Icon />
                      </div>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        pattern={field.pattern}
                        required={field.required}
                        className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 pl-10 pr-4 py-3"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {contactFormFields.slice(2).map((field) => (
                <div key={field.name} className="mb-6">
                  <label className="block mb-2 font-medium">{field.label}</label>
                  <div className="relative">
                    <div className="absolute top-1/2 transform -translate-y-1/2 left-3 text-amber-400">
                      <field.Icon />
                    </div>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows="4"
                        className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 pl-10 pr-4 py-3"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        pattern={field.pattern}
                        required={field.required}
                        className="w-full rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 pl-10 pr-4 py-3"
                      />
                    )}
                  </div>
                </div>
              ))}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-4 rounded-lg font-bold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;