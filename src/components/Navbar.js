import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const Navbar = ({ handleLogout }) => {
  const navigate = useNavigate();

  const notify = () => {
    toast.success('You have been logged out.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-links">
          <li>
            <NavLink to="/" activeClassName="active" className="nav-link">Home</NavLink>
          </li>
          <li>
            <NavLink to="/signup" activeClassName="active" className="nav-link">Sign Up</NavLink>
          </li>
          <li>
            <NavLink to="/login" activeClassName="active" className="nav-link">Login</NavLink>
          </li>
          <li>
            <NavLink to="/bills" activeClassName="active" className="nav-link">View Bills</NavLink>
          </li>
          <li>
            <NavLink to="/messages" activeClassName="active" className="nav-link">Messages</NavLink>
          </li>
          <li>
            <NavLink to="/announcements" activeClassName="active" className="nav-link">Announcements</NavLink>
          </li>
          <li>
            <NavLink to="/summary" activeClassName="active" className="nav-link">Bill Summary</NavLink>
          </li>
          <li>
            <NavLink to="/user-details" activeClassName="active" className="nav-link">User Details</NavLink>
          </li>
          <li>
            <button
              className="nav-link logout-button"
              onClick={() => {
                handleLogout();
                notify();
                navigate('/');
              }}
            >
              Logout
            </button>
          </li>
          <li>
            <NotificationBell loggedInUserEmail={localStorage.getItem('loggedInUserEmail')} />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
