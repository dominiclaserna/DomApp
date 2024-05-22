import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginForm.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already logged in
        const email = localStorage.getItem('loggedInUserEmail');
        if (email) {
            setIsLoggedIn(true);
            setLoggedInUserEmail(email);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Login successful!'); // Display success notification
                localStorage.setItem('loggedInUserEmail', formData.email);
                setIsLoggedIn(true);
                setLoggedInUserEmail(formData.email);
                navigate('/bills');
                window.location.reload();
            } else {
                toast.error('Incorrect email or password!'); // Display error notification
            }
        } catch (error) {
            console.error('Server error:', error);
            toast.error('Server error! Please try again later.'); // Display server error notification
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedInUserEmail');
        setIsLoggedIn(false);
        setLoggedInUserEmail('');
        toast.success('Logged out successfully!'); // Display logout notification
        window.location.reload();
    };

    return (
        <div className="login-container">
            <h1 className="login-heading">{isLoggedIn ? 'Welcome Back!' : 'Login'}</h1>
            <div className="login-background">
                {isLoggedIn ? (
                    <div className="logged-in-message">
                        <p className="logged-in-text">You are currently logged in as <strong>{loggedInUserEmail}</strong>.</p>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="login-input" />
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="login-input" />
                        <button type="submit" className="login-button">Login</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
