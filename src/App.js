import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import SignupForm from './components/SignupForm';
import BillForm from './components/BillForm';
import LoginForm from './components/LoginForm';
import UserDetails from './components/UserDetails';
import BillList from './components/BillList';
import MessageList from './components/MessageList';
import Navbar from './components/Navbar';
import AnnouncementsForm from './components/AnnouncementsForm'; 
import AnnouncementsList from './components/AnnouncementLists.js';
import NotificationBell from './components/NotificationBell'; 
import BillSummary from './components/BillSummary';
function App() {
  const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

  const handleLogout = () => {
    localStorage.removeItem('loggedInUserEmail');
    toast.success('Logged out successfully!'); // Display success notification
  };

  return (
    <Router>
      <div className="App" style={{ color: '#fff' }}> {/* Set color for all text elements */}
        <ToastContainer /> {/* Container for displaying notifications */}
        <Navbar handleLogout={handleLogout} />
        <div className="content" style={{ paddingTop: '4rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-bill" element={<BillForm />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/bills" element={<BillList />} />
            <Route path="/messages" element={<MessageList />} />
            <Route path="/announcements" element={<AnnouncementsList />} />
            <Route path="/summary" element={<BillSummary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home-container" style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ fontSize: '3rem', fontFamily: 'Arial, sans-serif', marginBottom: '1rem' }}>Welcome to the Real Estate Management App</h1>
      <h2 style={{ marginBottom: '2rem' }}>Your all-in-one solution for managing your real estate!</h2>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/login" style={{ display: 'inline-block', fontSize: '1.2rem', padding: '0.5rem 1rem', marginBottom: '0.5rem', color: '#fff', backgroundColor: '#007bff', textDecoration: 'none', fontWeight: 'bold', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Login</Link>
        <br />
        <span style={{ fontSize: '1rem', color: '#fff' }}>Not a member yet? <br /><Link to="/signup" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', marginLeft: '0.5rem' }}>Signup</Link></span>
      </div>
    </div>
  );
}

function SignupPage() {
  return (
    <>
      <h1 style={{ color: '#fff' }}>Sign Up Page</h1>
      <SignupForm />
    </>
  );
}

function LoginPage() {
  return (
    <>
      <LoginForm />
    </>
  );
}



export default App;
