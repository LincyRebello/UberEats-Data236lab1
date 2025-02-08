import React, { useEffect, useState } from "react";
import AppNavbar from "./AppNavbar";
import MainContent from "./MainContent";
import RestaurantList from "./RestaurantList";
import axios from 'axios';
import Footer from "./Footer";
import { Button, ButtonGroup } from 'react-bootstrap';
import '../../styles/Dashboard.css'; // Make sure to import your CSS file
import { baseUrl } from "../../services/api-services";

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('access_token');
        console.log('Using token for fetch:', token);
        const response = await axios.get(`${baseUrl}/api/restaurants/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Failed to fetch restaurants');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const sortByRatingLowToHigh = () => {
    const sorted = [...filteredRestaurants].sort((a, b) => a.rating - b.rating);
    setFilteredRestaurants(sorted);
    setActiveFilter('lowToHigh');
  };

  const sortByRatingHighToLow = () => {
    const sorted = [...filteredRestaurants].sort((a, b) => b.rating - a.rating);
    setFilteredRestaurants(sorted);
    setActiveFilter('highToLow');
  };

  const resetFilter = () => {
    setFilteredRestaurants(restaurants);
    setActiveFilter(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <AppNavbar />
      <div className="dashboard-content">
        <MainContent />
        <div className="filter-buttons mb-3">
          <Button 
            className={`filter-button ${activeFilter === 'lowToHigh' ? 'active' : ''}`}
            onClick={sortByRatingLowToHigh}
          >
            Rating: Low to High
          </Button>
          <Button 
            className={`filter-button ${activeFilter === 'highToLow' ? 'active' : ''}`}
            onClick={sortByRatingHighToLow}
          >
            Rating: High to Low
          </Button>
          <Button 
            className="reset-button"
            onClick={resetFilter}
          >
            Reset
          </Button>
        </div>
        <RestaurantList restaurants={filteredRestaurants} />
        <hr className="divider-line" />
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;


