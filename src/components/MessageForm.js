import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Import toast
import './MessageForm.css';

const MessageForm = ({ onMessageSubmit }) => {
  const [receiver, setReceiver] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const sender = localStorage.getItem('loggedInUserEmail');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onMessageSubmit === 'function') {
      onMessageSubmit({ sender, receiver, subject, body });
      setReceiver('');
      setSubject('');
      setBody('');
      toast.success('Message sent successfully!'); // Display success notification
    } else {
      console.error("onMessageSubmit is not a function");
    }
  };
  

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Receiver's Email"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <textarea
        placeholder="Message Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <button type="submit">Send Message</button>
    </form>
  );
};

export default MessageForm;