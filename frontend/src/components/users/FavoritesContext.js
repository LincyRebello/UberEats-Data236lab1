import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import { baseUrl } from '../../services/api-services';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites()
  }, []);

  const fetchFavorites = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(`${baseUrl}/api/favorites/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(response.data)
    } catch (error) {
      console.error('Error fetching restaurant profile:', error);
    }
  };


  const toggleFavorite = async (restaurant) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.patch(`${baseUrl}/api/favorites/${restaurant.id}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites((prevFavorites) => {
        if (prevFavorites.some((fav) => fav.restaurant.id === restaurant.id)) {
          return prevFavorites.filter((fav) => fav.restaurant.id !== restaurant.id);
        } else {
          return [...prevFavorites, response.data.favorite];
        }
      });
    } catch (error) {
      console.error('Error fetching restaurant profile:', error);
    }
    
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};