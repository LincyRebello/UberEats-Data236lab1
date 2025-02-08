import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/DashboardSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faHeart, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

function DashboardSidebar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored tokens or session data
    console.log('Logout called');
    localStorage.removeItem('access_token');
    alert('Successfully logged out!');
    navigate('/login/customer'); // Redirect to the login page
  };

  return (
    <div className="sidebar">
      <div className="logo">Uber <span>Eats</span></div>

      {/* User Info Section */}
      {user && (
        <div className="user-info">
          <img src={user.profilePicture || '/default-pic.png'} alt="User" className="profile-pic" />
          <div className="user-name">{user.name}</div>
          <Link to="/profile" className="manage-profile">Manage account</Link>
        </div>
      )}

      {/* Orders and Favorites Links */}
      <ul className="menu">
        <li>
          <Link to="/customer-orders">
            <FontAwesomeIcon icon={faBookmark} /> Orders
          </Link>
        </li>
        <li>
          <Link to="/favorites">
            <FontAwesomeIcon icon={faHeart} /> Favorites
          </Link>
        </li>
        <li>
          <Link to="/profile/customer/:customerId">
          <FontAwesomeIcon icon={faUser} /> Profile
          </Link>
        </li>
      </ul>

      {/* Divider */}
      <div className="divider"></div>

      {/* Placeholder Links for Business/Restaurant */}
      <ul className="menu">
        <li><a href="#">Create a business account</a></li>
        <li><a href="#">Add your restaurant</a></li>
        <li><a href="#">Sign up to deliver</a></li>
      </ul>

      {/* Divider */}
      <div className="divider"></div>

      {/* Sign Out Button */}
      <ul className="menu">
        <li>
          <a href="#" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Sign out
          </a>
        </li>
      </ul>

      {/* App Download Links */}
      <div className="app-links">
        <p>There's more to love in the app.</p>
        <div className="store-buttons">
          <a href="https://apps.apple.com/us/app/uber-eats-food-delivery/id1058959277" className="store-button">
            <i className="fab fa-apple"></i> iPhone
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.ubercab.eats&hl=en_US" className="store-button">
            <i className="fab fa-android"></i> Android
          </a>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebar;
