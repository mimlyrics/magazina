import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Notification = ({ user }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching notifications (this could come from an API)
  useEffect(() => {
    // Simulating different notifications based on user role
    if (user?.role === 'customer') {
      setNotificationList([
        { id: 1, message: 'Your order #1234 has been shipped!' },
        { id: 2, message: 'New products are available in your favorite category.' },
      ]);
    } else if (user?.role === 'admin') {
      setNotificationList([
        { id: 1, message: 'You have new customer messages to review.' },
        { id: 2, message: 'A product is out of stock; update inventory.' },
      ]);
    } else if (user?.role === 'supplier') {
      setNotificationList([
        { id: 1, message: 'Your product has been reviewed by a customer.' },
        { id: 2, message: 'Stock levels for your product are low.' },
      ]);
    }

    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [user?.role]);

  const handleNotificationToggle = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  return (
    <div className={`min-h-screen bg-indigo-900 text-white p-6 md:p-12`}>
      <motion.div
        className="max-w-3xl mx-auto bg-indigo-800 rounded-lg p-8 shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Notifications</h2>

        {/* Notification Preferences */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Enable Notifications</h3>
            <button
              onClick={handleNotificationToggle}
              className={`${
                notificationsEnabled ? 'bg-green-500' : 'bg-gray-500'
              } px-4 py-2 rounded-lg transition duration-300`}
            >
              {notificationsEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Notification List */}
        {loading ? (
          <p className="text-center text-gray-400">Loading notifications...</p>
        ) : (
          <div className="space-y-4">
            {notificationList.length === 0 ? (
              <p className="text-center text-gray-400">No notifications available.</p>
            ) : (
              notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 bg-indigo-700 rounded-lg shadow-md"
                >
                  <p>{notification.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Notification;
