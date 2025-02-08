import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import AppNavbar from './AppNavbar';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import '../../styles/RestaurantDetail.css';
import Footer from './Footer';
import { baseUrl } from '../../services/api-services';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, selectAllRestaurants } from '../../slices/restaurantSlice';
import { selectCart } from '../../slices/orderSlice';


const RestaurantDetail = () => {
  const [cartItems, totalPrice, updateCartItems] = useCart();
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const dispatch = useDispatch();
  const restaurants = useSelector(selectAllRestaurants);
  const cart = useSelector(selectCart);


  const fetchDishes = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(
        `${baseUrl}/api/restaurants/${restaurantId}/dishes/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDishes(res.data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      setDishes([]);
    }
  };


  useEffect(() => {
    dispatch(fetchRestaurants());
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(
          `${baseUrl}/api/restaurants/${restaurantId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRestaurant(res.data);
      } catch (error) {
        console.error('Error fetching restaurant details', error);
      }
    };


    fetchRestaurant();
    fetchDishes();
  }, [restaurantId, dispatch]);


  const handleViewCart = () => {
    navigate('/cart', { state: { cart: cartItems } });
  };


  const handleImageLoad = () => {
    setImageLoaded(true);
  };


  const handleImageError = () => {
    setImageLoaded(false);
  };


  if (!restaurant) return <div>Loading...</div>;


  return (
    <>
      <AppNavbar />
      <div className="restaurant-header">
        <img
          src={restaurant.image || 'https://via.placeholder.com/1200x400'}
          alt={restaurant.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`img-fluid w-100 ${imageLoaded ? '' : 'd-none'}`}
        />
        {!imageLoaded && (
          <div className="placeholder-image d-flex align-items-center justify-content-center">
            <span>Image not available</span>
          </div>
        )}
        <div className="restaurant-info">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
        </div>
      </div>
      <Container className="mt-4">
        <h2 className="mb-3">Menu</h2>
        <Row>
          {dishes.map((dish) => (
            <Col xs={12} sm={6} md={4} lg={3} key={dish.id} className="mb-4">
              <DishItem
                dish={dish}
                cartItem={cartItems.find(cartItem => cartItem.dish.id === dish.id)}
                updateCartItems={updateCartItems}
              />
            </Col>
          ))}
        </Row>
        <Button variant="primary" onClick={handleViewCart} className="mt-3">View Cart</Button>
      </Container>
      <hr className="divider-line" />
      <Footer />
    </>
  );
};


const DishItem = ({ dish, cartItem, updateCartItems }) => {
  return (
    <Card className="h-100">
      {dish.image && (
        <Card.Img
          variant="top"
          src={`${baseUrl}${dish.image}`}
          alt={dish.name}
          style={{ height: "150px", objectFit: "cover" }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{dish.name}</Card.Title>
        <Card.Text>{dish.description}</Card.Text>
        <Card.Text className="mt-auto">Price: ${dish.price}</Card.Text>
        {cartItem?.quantity > 0 ? (
          <Form.Group className="d-flex align-items-center mt-2">
            <Button variant="outline-secondary" size="sm" onClick={() => updateCartItems(dish.id, cartItem.quantity - 1)}>-</Button>
            <Form.Control type="text" value={cartItem.quantity} readOnly className="mx-2 text-center" style={{width: '50px'}} />
            <Button variant="outline-secondary" size="sm" onClick={() => updateCartItems(dish.id, cartItem.quantity + 1)}>+</Button>
          </Form.Group>
        ) : (
          <Button variant="primary" onClick={() => updateCartItems(dish.id, 1)} className="mt-2">Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
  );
};


export default RestaurantDetail;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import useCart from '../../hooks/useCart';
// import AppNavbar from './AppNavbar';
// import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
// import '../../styles/RestaurantDetail.css'; // Make sure to create this CSS file
// import Footer from './Footer';
// import { baseUrl } from '../../services/api-services';

// const RestaurantDetail = () => {
//   const [cartItems, totalPrice, updateCartItems] = useCart();
//   const { restaurantId } = useParams();
//   const [restaurant, setRestaurant] = useState(null);
//   const [dishes, setDishes] = useState([]);
//   const navigate = useNavigate();
//   const [imageLoaded, setImageLoaded] = useState(false);

//   const fetchDishes = async () => {
//     try {
//       const token = localStorage.getItem('access_token');
//       const res = await axios.get(
//         `${baseUrl}/api/restaurants/${restaurantId}/dishes/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setDishes(res.data);
//     } catch (error) {
//       console.error('Error fetching dishes:', error);
//       setDishes([]);
//     }
//   };

//   useEffect(() => {
//     const fetchRestaurant = async () => {
//       try {
//         const token = localStorage.getItem('access_token');
//         const res = await axios.get(
//           `${baseUrl}/api/restaurants/${restaurantId}/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setRestaurant(res.data);
//       } catch (error) {
//         console.error('Error fetching restaurant details', error);
//       }
//     };

//     fetchRestaurant();
//     fetchDishes();
//   }, [restaurantId]);

//   const handleViewCart = () => {
//     navigate('/cart', { state: { cart: cartItems } });
//   };

//   const handleImageLoad = () => {
//     setImageLoaded(true);
//   };

//   const handleImageError = () => {
//     setImageLoaded(false);
//   };

//   if (!restaurant) return <div>Loading...</div>;

//   return (
//     <>
//       <AppNavbar />
//       <div className="restaurant-header">
//         <img
//           src={restaurant.image || 'https://via.placeholder.com/1200x400'}
//           alt={restaurant.name}
//           onLoad={handleImageLoad}
//           onError={handleImageError}
//           className={`img-fluid w-100 ${imageLoaded ? '' : 'd-none'}`}
//         />
//         {!imageLoaded && (
//           <div className="placeholder-image d-flex align-items-center justify-content-center">
//             <span>Image not available</span>
//           </div>
//         )}
//         <div className="restaurant-info">
//           <h1>{restaurant.name}</h1>
//           <p>{restaurant.description}</p>
//         </div>
//       </div>
//       <Container className="mt-4">
//         <h2 className="mb-3">Menu</h2>
//         <Row>
//           {dishes.map((dish) => (
//             <Col xs={12} sm={6} md={4} lg={3} key={dish.id} className="mb-4">
//               <DishItem
//                 dish={dish}
//                 cartItem={cartItems.find(cartItem => cartItem.dish.id === dish.id)}
//                 updateCartItems={updateCartItems}
//               />
//             </Col>
//           ))}
//         </Row>
//         <Button variant="primary" onClick={handleViewCart} className="mt-3">View Cart</Button>
//       </Container>
//       <hr className="divider-line" />
//         <Footer />
//     </>
//   );
// };

// const DishItem = ({ dish, cartItem, updateCartItems }) => {
//   return (
//     <Card className="h-100">
//       {dish.image && (
//         <Card.Img
//           variant="top"
//           src={`${baseUrl}${dish.image}`}
//           alt={dish.name}
//           style={{ height: "150px", objectFit: "cover" }}
//         />
//       )}
//       <Card.Body className="d-flex flex-column">
//         <Card.Title>{dish.name}</Card.Title>
//         <Card.Text>{dish.description}</Card.Text>
//         <Card.Text className="mt-auto">Price: ${dish.price}</Card.Text>
//         {cartItem?.quantity > 0 ? (
//           <Form.Group className="d-flex align-items-center mt-2">
//             <Button variant="outline-secondary" size="sm" onClick={() => updateCartItems(dish.id, cartItem.quantity - 1)}>-</Button>
//             <Form.Control type="text" value={cartItem.quantity} readOnly className="mx-2 text-center" style={{width: '50px'}} />
//             <Button variant="outline-secondary" size="sm" onClick={() => updateCartItems(dish.id, cartItem.quantity + 1)}>+</Button>
//           </Form.Group>
//         ) : (
//           <Button variant="primary" onClick={() => updateCartItems(dish.id, 1)} className="mt-2">Add to Cart</Button>
//         )}
//       </Card.Body>
//     </Card>
    
//   );
// };

// export default RestaurantDetail;




