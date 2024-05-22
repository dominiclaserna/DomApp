import React, { useState, useEffect } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { toast } from 'react-toastify'; // Import the toast module
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import './NotificationBell.css';

const NotificationBell = ({ loggedInUserEmail }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotificationCount();
  }, [loggedInUserEmail]); // Trigger effect whenever loggedInUserEmail changes

  const fetchNotificationCount = async () => {
    try {
      console.log('Fetching notification count for user:', loggedInUserEmail); // Log the email being used for fetching
      const response = await fetch(`/notifications/user/${encodeURIComponent(loggedInUserEmail)}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Notification data:', data); // Log the notification data received
        const unseenNotifications = data.filter(notification => !notification.seen); // Filter out seen notifications
        setNotificationCount(unseenNotifications.length); // Set notification count based on unseen notifications
        setNotifications(unseenNotifications); // Set the notifications array to unseen notifications
        if (unseenNotifications.length > 0) {
          // If there are new notifications, display a toast notification
          toast.info(`You have ${unseenNotifications.length} new notifications`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else {
        setError('Failed to fetch notification count');
      }
    } catch (error) {
      setError('Error fetching notification count');
    }
  };

  const handleBellClick = async () => {
    try {
      // Display notification details as toast
      notifications.forEach(notification => {
        toast.info(`You have ${notification.about}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  
      // Update the seen status of notifications when bell is clicked
      await Promise.all(
        notifications.map(async notification => {
          const response = await fetch(`/notifications/${notification._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            // If update is successful, set seen status locally
            setNotifications(prevNotifications => prevNotifications.map(prevNotification =>
              prevNotification._id === notification._id ? { ...prevNotification, seen: true } : prevNotification
            ));
          }
        })
      );
  
      // Add a delay of three seconds before reloading the page
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Error updating notification seen status:', error);
      setError('Error updating notification seen status');
    }
  };
  

  return (
    <button className="notification-bell" onClick={handleBellClick} aria-label="Notifications">
      <IoIosNotificationsOutline />
      {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
      {error && <span className="error-message">{error}</span>}
    </button>
  );
};

export default NotificationBell;
