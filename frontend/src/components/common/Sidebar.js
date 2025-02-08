import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">Uber <span>Eats</span></div>
      <div className="buttons">
        <Link to="/signup/customer" className="button button-primary">Sign up</Link>
        <Link to="/login/customer" className="button button-secondary">Log in</Link>
      </div>
      <ul className="menu">
        <li><a href="#">Create a business account</a></li>
        <li><Link to="/signup/restaurant">Add your restaurant</Link></li>
        <li><Link to="/login/restaurant">Restaurant Login</Link></li>
      </ul>
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

export default Sidebar;
