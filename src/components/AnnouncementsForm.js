import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './AnnouncementsForm.css';

const AnnouncementsForm = ({ onAnnouncementSubmit }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const manager = localStorage.getItem('loggedInUserEmail');
    const createdAt = Date.now(); // Get the current date and time
    const handleSubmit = async (e) => {
        e.preventDefault();

        onAnnouncementSubmit({ title, message, manager, createdAt });
        setTitle('');
        setMessage('');
        toast.success('Announcement created successfully!'); // Display success notification
    };

    
    return (
        <div className="announcements-form-container">
            <h2 color='black'>Create Announcement</h2>
            <form onSubmit={handleSubmit} className="announcements-form">
                <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message"></textarea>
                <button type="submit">Create Announcement</button>
            </form>
        </div>
    );
};

export default AnnouncementsForm;
