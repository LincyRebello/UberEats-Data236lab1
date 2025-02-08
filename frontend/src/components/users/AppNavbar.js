import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaCaretDown } from 'react-icons/fa';
import '../../styles/AppNavbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import DashboardSidebar from './DashboardSidebar';
import { Link, useNavigate } from 'react-router-dom'; //
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import axios from 'axios';
import useCart from '../../hooks/useCart';
import { baseUrl } from '../../services/api-services';

const Navbar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Delivery");
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState('');
  const [cartItems, setCartItems] = useState(0); // State for cart items 
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();
  
  // Address state
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
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
    fetchProfile(); 
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(`${baseUrl}/api/customers/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if(response.data.delivery_address){
        setAddress(response.data.delivery_address)
      }
    } catch (error) {
      console.error('Error fetching restaurant profile:', error);
    //   setError('Failed to fetch restaurant data.');
    //   setLoading(false);
    }
  };
  const updateAddress = async (adddress) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.patch(`${baseUrl}/api/customers/profile/`,{
        delivery_address:adddress
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });
      console.log(response)
    } catch (error) {
      console.error('Error fetching restaurant profile:', error);
    //   setError('Failed to fetch restaurant data.');
    //   setLoading(false);
    }
  };
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Handle address select using Google Places API
  // const handleSelect = async (value) => {
  //   const results = await geocodeByAddress(value);
  //   const latLng = await getLatLng(results[0]);
  //   updateAddress(value);
  //   setAddress(value);
  //   setCoordinates(latLng);
  //   setShowModal(false);
  // };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    
    // Extract only the street address (the part before the first comma)
    const streetAddress = results[0].formatted_address.split(',')[0]; 
  
    updateAddress(streetAddress); // Update the delivery address
    setAddress(streetAddress); // Set the address to just the street address
    setCoordinates(latLng);
    setShowModal(false);
  };
  
  return (
    <div className="navbar">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="navbar-left d-flex align-items-center">
            <button ref={hamburgerRef} className="nav_hamburger-menu" onClick={toggleSidebar}>
              ☰
            </button>
            <div className="logo">
              <Link to="/dashboard">Uber <b>Eats</b></Link> {/* Added Link to homepage */}
            </div>
          </div>

          <div className="navbar-middle d-flex align-items-center">
            <div className="order-toggle">
              <button 
                className={`order-btn ${selectedOption === "Delivery" ? 'active' : ''}`} 
                onClick={() => handleOptionClick("Delivery")}
              >
                Delivery
              </button>
              <button 
                className={`order-btn ${selectedOption === "Pickup" ? 'active' : ''}`} 
                onClick={() => handleOptionClick("Pickup")}
              >
                Pickup
              </button>
              <div className="slider" style={{ left: selectedOption === "Delivery" ? '0' : '50%' }} />
            </div>

            <div className="location" onClick={handleShowModal}>
              <FaMapMarkerAlt />
              <span className="address-text">{address || 'Now'}</span>
              <FaCaretDown className="caret-icon" />
            </div>
          </div>

          <div className="navbar-right d-flex align-items-center">
            <div className="search-bar">
              <FaSearch />
              <input type="text" placeholder="Search Uber Eats" />
            </div>
            <div className="position-relative" onClick={() => navigate('/cart')}> {/* Navigate to /cart */}
              <FaShoppingCart />
              {cartItems  > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-circle">
                  {cartItems}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarVisible && (
        <>
          <div className="overlay" onClick={toggleSidebar}></div>

          <div ref={sidebarRef} className={`sidebar ${isSidebarVisible ? 'active' : ''}`}>
            <DashboardSidebar />
          </div>
        </>
      )}

      {/* Address Search Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: 'Enter your address...',
                    className: 'form-control',
                  })}
                />
                <div>
                  {loading ? <div>Loading...</div> : null}

                  {suggestions.map(suggestion => {
                    const style = {
                      backgroundColor: suggestion.active ? '#fafafa' : '#ffffff',
                      cursor: 'pointer',
                    };
                    return (
                      <div key={suggestion.placeId} {...getSuggestionItemProps(suggestion, { style })}>
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Navbar;
