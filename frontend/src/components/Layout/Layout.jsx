import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Notification from '../Notification/Notification';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a120b] to-[#3c2a21]">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Notification />
    </div>
  );
};

export default Layout;