import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaEye, FaReply, FaTrash, FaCheckCircle, FaClock, FaReplyAll } from 'react-icons/fa';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [stats, setStats] = useState({ totalMessages: 0, unreadMessages: 0, repliedMessages: 0 });

  useEffect(() => {
    loadMessages();
    loadStats();
  }, []);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.get('http://localhost:5001/api/v1/contact', config);
      setMessages(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load messages');
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.get('http://localhost:5001/api/v1/contact/stats', config);
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    // Mark as read if it's unread
    if (message.status === 'unread') {
      updateMessageStatus(message._id, { status: 'read' });
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        await axios.delete(`http://localhost:5001/api/v1/contact/${id}`, config);
        loadMessages();
        loadStats();
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to delete message');
      }
    }
  };

  const updateMessageStatus = async (id, statusData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.put(`http://localhost:5001/api/v1/contact/${id}`, statusData, config);
      loadMessages();
      loadStats();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update message');
    }
  };

  const handleReplyMessage = async () => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const replyData = {
        status: 'replied',
        replied: true,
        repliedAt: new Date(),
        replyMessage: replyMessage
      };

      await axios.put(`http://localhost:5001/api/v1/contact/${selectedMessage._id}`, replyData, config);
      
      // Reset reply form
      setReplyMessage('');
      setIsReplying(false);
      
      // Reload messages and stats
      loadMessages();
      loadStats();
      
      // Close message view
      setSelectedMessage(null);
      
      alert('Reply sent successfully!');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to send reply');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'unread':
        return 'bg-red-900/20 text-red-400';
      case 'read':
        return 'bg-yellow-900/20 text-yellow-400';
      case 'replied':
        return 'bg-green-900/20 text-green-400';
      default:
        return 'bg-gray-900/20 text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="text-amber-400">Loading messages...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Messages</h1>
          <p className="text-amber-100/80">Manage customer inquiries and messages</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#3c2a21] p-6 rounded-xl border border-amber-900/30">
            <div className="flex items-center">
              <div className="bg-amber-900/30 p-3 rounded-lg mr-4">
                <FaEnvelope className="text-amber-400 text-xl" />
              </div>
              <div>
                <p className="text-amber-100/80">Total Messages</p>
                <p className="text-2xl font-bold">{stats.totalMessages}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#3c2a21] p-6 rounded-xl border border-amber-900/30">
            <div className="flex items-center">
              <div className="bg-red-900/30 p-3 rounded-lg mr-4">
                <FaClock className="text-red-400 text-xl" />
              </div>
              <div>
                <p className="text-amber-100/80">Unread</p>
                <p className="text-2xl font-bold">{stats.unreadMessages}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#3c2a21] p-6 rounded-xl border border-amber-900/30">
            <div className="flex items-center">
              <div className="bg-green-900/30 p-3 rounded-lg mr-4">
                <FaCheckCircle className="text-green-400 text-xl" />
              </div>
              <div>
                <p className="text-amber-100/80">Replied</p>
                <p className="text-2xl font-bold">{stats.repliedMessages}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30">
              <div className="p-6 border-b border-amber-900/30">
                <h2 className="text-xl font-bold">Messages</h2>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="p-6 text-center text-amber-100/80">
                    No messages found
                  </div>
                ) : (
                  <div className="divide-y divide-amber-900/30">
                    {messages.map((message) => (
                      <div 
                        key={message._id} 
                        className={`p-4 cursor-pointer hover:bg-[#3c2a21]/50 transition-colors ${
                          selectedMessage && selectedMessage._id === message._id ? 'bg-[#3c2a21]/50' : ''
                        }`}
                        onClick={() => handleViewMessage(message)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold truncate">{message.subject}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(message.status)}`}>
                            {message.status}
                          </span>
                        </div>
                        <p className="text-amber-100/80 text-sm mb-2 truncate">{message.name}</p>
                        <p className="text-amber-100/60 text-xs">{formatDate(message.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30">
                <div className="p-6 border-b border-amber-900/30 flex justify-between items-center">
                  <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage._id)}
                      className="bg-red-900/30 hover:bg-red-900/50 text-red-400 p-2 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-amber-100/80 text-sm">From</p>
                      <p className="font-bold">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <p className="text-amber-100/80 text-sm">Email</p>
                      <p className="font-bold">{selectedMessage.email}</p>
                    </div>
                    <div>
                      <p className="text-amber-100/80 text-sm">Phone</p>
                      <p className="font-bold">{selectedMessage.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-amber-100/80 text-sm">Date</p>
                      <p className="font-bold">{formatDate(selectedMessage.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-amber-100/80 text-sm mb-2">Message</p>
                    <div className="bg-[#3c2a21] p-4 rounded-lg">
                      <p>{selectedMessage.message}</p>
                    </div>
                  </div>
                  
                  {selectedMessage.replyMessage && (
                    <div className="mb-6">
                      <p className="text-amber-100/80 text-sm mb-2">Reply</p>
                      <div className="bg-green-900/20 p-4 rounded-lg">
                        <p>{selectedMessage.replyMessage}</p>
                        <p className="text-amber-100/60 text-xs mt-2">
                          Replied on {formatDate(selectedMessage.repliedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!isReplying && selectedMessage.status !== 'replied' && (
                    <button
                      onClick={() => setIsReplying(true)}
                      className="flex items-center bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <FaReply className="mr-2" />
                      Reply to Message
                    </button>
                  )}
                  
                  {isReplying && (
                    <div className="mt-6">
                      <p className="text-amber-100/80 text-sm mb-2">Your Reply</p>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply here..."
                        rows="4"
                        className="w-full rounded-lg bg-[#3c2a21] text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 px-4 py-3 mb-4"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleReplyMessage}
                          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <FaReplyAll className="mr-2" />
                          Send Reply
                        </button>
                        <button
                          onClick={() => setIsReplying(false)}
                          className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#2D1B0E]/50 rounded-xl border border-amber-900/30 h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <FaEnvelope className="text-6xl text-amber-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Select a Message</h3>
                  <p className="text-amber-100/80">Choose a message from the list to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;