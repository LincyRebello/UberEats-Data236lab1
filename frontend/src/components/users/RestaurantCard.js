import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import '../../styles/RestaurantCard.css';
import { FavoritesContext } from '../users/FavoritesContext';
import { baseUrl } from '../../services/api-services';

const RestaurantCard = ({ restaurant, onClick }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const isFavorite = favorites.some(fav => fav.restaurant.id === restaurant.id);

  return (
    <Card className="restaurant-card" onClick={onClick}>
      <div className="card-img-wrapper">
        <Card.Img
          variant="top"
          src={`${baseUrl}${restaurant.image}` || 'placeholder_image_url'} // Use a placeholder if the image is null
          alt={restaurant.name}
          className="card-img"
        />
        {restaurant.offer && (
          <span className="offer-badge">{restaurant.offer}</span>
        )}
        <Button
          variant="link"
          className="favorite-button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(restaurant);
          }}
        >
          {isFavorite ? '♥' : '♡'}
        </Button>
        {restaurant.rating && (
          <span className="rating-circle">{restaurant.rating}</span>
        )}
      </div>
      <Card.Body>
        <Card.Title>{restaurant.name}</Card.Title>
        <Card.Text>{restaurant.description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RestaurantCard;
