import React, { useState, useEffect } from 'react';
import './UserDetails.css'; // Import UserDetails stylesheet

const UserDetails = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                // Retrieve email from local storage
                const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
                const response = await fetch(`/user-details/${encodeURIComponent(loggedInUserEmail)}`);
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setError('User not found');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setError('Internal server error');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div className="user-details-container">
            <div className="user-details-background">
                {user && (
                    <table className="user-details-table">
                        <tbody>
                            <tr>
                                <td><strong>First Name:</strong></td>
                                <td>{user.firstName}</td>
                            </tr>
                            <tr>
                                <td><strong>Last Name:</strong></td>
                                <td>{user.lastName}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <td><strong>User Type:</strong></td>
                                <td>{user.userType}</td>
                            </tr>
                            {user.userType === 'tenant' && (
                                <tr>
                                    <td><strong>Manager:</strong></td>
                                    <td>{user.manager}</td>
                                </tr>
                            )}
                            {/* Display other user details here */}
                        </tbody>
                    </table>
                )}
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default UserDetails;
