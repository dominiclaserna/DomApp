import React, { useEffect, useState } from 'react';
import MessageForm from './MessageForm'; // Import MessageForm component
import './MessageList.css';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [userType, setUserType] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

  useEffect(() => {
    checkLoginStatus();
    if (loggedInUserEmail) {
      fetchMessages();
      fetchUserType();
    }
  }, [currentPage, selectedFilter]);

  useEffect(() => {
    if (userType) {
      fetchFilterOptions();
    }
  }, [userType]);

  const checkLoginStatus = () => {
    const loggedIn = !!loggedInUserEmail;
    setIsLoggedIn(loggedIn);
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/messages/user/${encodeURIComponent(loggedInUserEmail)}?filter=${encodeURIComponent(selectedFilter)}&page=${currentPage}&limit=${itemsPerPage}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  const handleSendMessage = async (messageData) => {
    try {
      const response = await fetch('/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      if (response.ok) {
        // Message sent successfully, perhaps update the UI or show a success message
        console.log('Message sent successfully!');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const fetchUserType = async () => {
    try {
      const response = await fetch(`/user-details/${encodeURIComponent(loggedInUserEmail)}`);
      if (response.ok) {
        const userData = await response.json();
        setUserType(userData.userType);
      } else {
        console.error('Failed to fetch user type');
      }
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/messages/unique-receivers');
      if (response.ok) {
        const data = await response.json();
        console.log('Filter options:', data);
        setFilterOptions(data);
      } else {
        throw new Error('Failed to fetch filter options');
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const renderMessageRow = (message) => (
    <div key={message._id} className="message">
      <p><strong>{message.subject}</strong></p>
      <p>{message.body}</p>
      <p><em>From: {message.sender}</em></p>
      <p><em>To: {message.receiver}</em></p>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="login-message">
        <h3>Please log in to view your messages.</h3>
      </div>
    );
  }

  return (
    <div className="message-list-container">
      {userType === 'manager' && (
        <div className="filter-container">
          <label htmlFor="receiver-filter">Filter by Receiver:</label>
          <select
            id="receiver-filter"
            value={selectedFilter}
            onChange={(e) => {
              setSelectedFilter(e.target.value);
              setCurrentPage(1); // Reset to the first page when filter changes
            }}
          >
            <option value="">All</option>
            {filterOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="message-list">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map(renderMessageRow)
        ) : (
          <p>No messages found.</p>
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={messages.length < itemsPerPage}
        >
          Next
        </button>
      </div>
      <div className="message-form-container"> {/* Add MessageForm component here */}
              <MessageForm onMessageSubmit={handleSendMessage} />
      </div>
    </div>
  );
};

export default MessageList;
