import React, { useState, useEffect } from 'react';
import './AnnouncementLists.css';
import AnnouncementsForm from './AnnouncementsForm'; // Import the AnnouncementsForm component

const AnnouncementsList = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [userType, setUserType] = useState('');
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

    useEffect(() => {
        fetchAnnouncements();
        fetchUserType();
    }, []);

    const fetchAnnouncements = async () => {
    try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL; // Use environment variable for the API base URL
        const response = await fetch(`${apiUrl}/announcements`);
        if (response.ok) {
            const data = await response.json();
            setAnnouncements(data);
        } else {
            console.error('Failed to fetch announcements');
        }
    } catch (error) {
        console.error('Server error:', error);
    }
};

const fetchUserType = async () => {
    try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL; // Use environment variable for the API base URL
        const response = await fetch(`${apiUrl}/user-details/${encodeURIComponent(loggedInUserEmail)}`);
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

    // Define a function to handle announcement submission
    const handleAnnouncementSubmit = async (announcementData) => {
        try {
            const response = await fetch('/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(announcementData)
            });
            if (response.ok) {
                console.log('Announcement created successfully');
                fetchAnnouncements(); // Refresh announcements after submission
            } else {
                console.error('Failed to create announcement');
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
        }
    };

    return (
        <div className="announcements-list-container">
            <h2 className="announcements-title">Announcements</h2>
            {userType === 'manager' && <AnnouncementsForm onAnnouncementSubmit={handleAnnouncementSubmit} />}
            {announcements.length === 0 ? (
                <p>No announcements available</p>
            ) : (
                <div className="announcements">
                    {announcements.map((announcement, index) => (
                        <div key={index} className="announcement">
                            <h3 className="announcement-title">{announcement.title}</h3>
                            <p className="announcement-message">{announcement.message}</p>
                            <p className="announcement-details">Posted by: {announcement.manager}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnnouncementsList;
