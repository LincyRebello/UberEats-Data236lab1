import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Home.css';
import '../../styles/Sidebar.css';
import Sidebar from './Sidebar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      !hamburgerRef.current.contains(event.target)
    ) {
      setSidebarVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchAddressSuggestions = async (input) => {
    const apiKey = 'YOUR_GOOGLE_PLACES_API_KEY';
    const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
    try {
      const response = await axios.get(endpoint, {
        params: {
          input,
          key: apiKey,
          types: 'address',
          components: 'country:us',
        },
      });
      setSuggestions(response.data.predictions);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (e.target.value.length > 3) {
      fetchAddressSuggestions(e.target.value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion);
    setSuggestions([]);
  };

  const handleSearch = () => {
    const token = localStorage.getItem('access_token'); // Retrieve the token from local storage
  
    if (!token) {
      alert("Kindly login or signup first");
    } else if (address.trim()) {
      navigate('/');
    }
  };
  

  return (
    <div className="home">
      <nav className="home_navbar navbar navbar-expand-lg">
        <div className="container">
          <div className="d-flex align-items-center">
            <button ref={hamburgerRef} className="home_hamburger-menu" onClick={toggleSidebar}>
              ☰
            </button>
            <div className="home_logo">Uber <b>Eats</b></div>
          </div>
          <div className="home_nav-right d-flex align-items-center">
            <Link to="/login/customer" className="btn btn-dark me-2">Log in</Link>
            <Link to="/signup/customer" className="btn btn-dark">Sign up</Link>
          </div>
        </div>
      </nav>

      {isSidebarVisible && (
        <>
          {/* Overlay to grey out the background */}
          <div className="overlay" onClick={() => setSidebarVisible(false)}></div> {/* Overlay div */}

          <div ref={sidebarRef}>
            <Sidebar />
          </div>
        </>
      )}

      <header className="home_header d-flex flex-column justify-content-center align-items-end">
        <h1 className="text-right">Order <b>delivery</b> near you</h1>
        <div className="home_search-bar">
          <input
            type="text"
            className="form-control"
            placeholder="Enter delivery address"
            value={address}
            onChange={handleAddressChange}
          />
          {suggestions.length > 0 && (
            <ul className="home_suggestions-list">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion.description)}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
          <select className="form-select">
            <option>Deliver now</option>
            <option>Schedule for later</option>
          </select>
          <button className="btn btn-dark ms-2 home_search-btn" onClick={handleSearch}>Search here</button>
        </div>
        <div className="home_or-signin mt-2">
          Or <Link to="/signup/customer">Sign in</Link>
        </div>
      </header>
    </div>
  );
};

export default Home;
