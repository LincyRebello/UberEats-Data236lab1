import React, { useContext, useEffect } from 'react';
import RestaurantCard from './RestaurantCard';
import { Container, Row, Col } from 'react-bootstrap';
import { FavoritesContext } from '../users/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, selectAllRestaurants } from '../../slices/restaurantSlice';


const RestaurantList = () => {
 const { toggleFavorite } = useContext(FavoritesContext);
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const restaurants = useSelector(selectAllRestaurants);


 useEffect(() => {
   dispatch(fetchRestaurants());
 }, [dispatch]);


 return (
   <Container>
     <h2><b>Featured on Uber Eats</b></h2>
     <Row>
       {restaurants.length > 0 ? (
         restaurants.map((restaurant) => (
           <Col key={restaurant.id} xs={12} sm={6} md={4} lg={3}>
             <RestaurantCard
               restaurant={restaurant}
               toggleFavorite={() => toggleFavorite(restaurant)}
               onClick={() => navigate(`/restaurant/${restaurant.id}`)}
             />
           </Col>
         ))
       ) : (
         <Col>
           <p>No restaurants found. Please try again later.</p>
         </Col>
       )}
     </Row>
   </Container>
 );
};


export default RestaurantList;



// import React, { useContext } from 'react';
// import RestaurantCard from './RestaurantCard';
// import { Container, Row, Col } from 'react-bootstrap';
// import { FavoritesContext } from '../users/FavoritesContext';
// import { useNavigate } from 'react-router-dom';

// const RestaurantList = ({ restaurants }) => {
//   const { toggleFavorite } = useContext(FavoritesContext);
//   const navigate = useNavigate();

//   return (
//     <Container>
//       <h2><b>Featured on Uber Eats</b></h2>
//       <Row>
//         {restaurants.length > 0 ? (
//           restaurants.map((restaurant) => (
//             <Col key={restaurant.id} xs={12} sm={6} md={4} lg={3}>
//               <RestaurantCard
//                 restaurant={restaurant}
//                 toggleFavorite={() => toggleFavorite(restaurant)}
//                 onClick={() => navigate(`/restaurant/${restaurant.id}`)}
//               />
//             </Col>
//           ))
//         ) : (
//           <Col>
//             <p>No restaurants found. Please try again later.</p>
//           </Col>
//         )}
//       </Row>
//     </Container>
//   );
// };

// export default RestaurantList;
