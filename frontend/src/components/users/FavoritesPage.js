import React, { useContext } from 'react';
import RestaurantCard from './RestaurantCard';
import { Container, Row, Col } from 'react-bootstrap';
import { FavoritesContext } from '../users/FavoritesContext'; // Import context
import AppNavbar from './AppNavbar'; // Import the Navbar
import 'bootstrap/dist/css/bootstrap.min.css';


const FavoritesPage = () => {
  const { favorites } = useContext(FavoritesContext);

  return (
    <Container>
        <AppNavbar />
      <h2><b>Recently Added</b></h2>
      <Row>
        {favorites.length === 0 ? (
          <p>No favorite restaurants yet.</p>
        ) : (
          favorites.map((favorite) => (
            <Col key={favorite.id} xs={12} sm={6} md={4} lg={3}>
              <RestaurantCard restaurant={favorite.restaurant} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default FavoritesPage;