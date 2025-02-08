import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import { FaMapMarkerAlt } from 'react-icons/fa';
import '../../styles/Cart.css';
import { baseUrl } from '../../services/api-services';
//import { selectCart, selectTotalPrice } from '../../slices/orderSlice';
import { fetchCartItems, selectCart, selectTotalPrice, updateCartItem } from '../../slices/orderSlice';


const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCart);
  const totalPrice = useSelector(selectTotalPrice);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isPick, setIsPick] = useState(false);
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });


  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const orderData = {
        delivery_address: deliveryAddress,
        is_pick: isPick,
      };


      const response = await axios.post(`${baseUrl}/api/orders/create/`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });


      alert(`Order placed: ${response.data.order_id}`);
      navigate('/customer-orders');
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };


  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setDeliveryAddress(value);
    setCoordinates(latLng);
  };

  // Add updateCartItems function
  const updateCartItems = (dishId, quantity) => {
    dispatch(updateCartItem({ dish_id: dishId, quantity }));
  };

  useEffect(() => {
    console.log("Cart items:", cartItems);
  }, [cartItems]);

  useEffect(() => {
    console.log("Inside useEffect");
    dispatch(fetchCartItems());
  }, []);


  if (!cartItems || cartItems.length === 0) {
    return (
      <Container className="mt-5">
        <Card className="text-center">
          <Card.Body>
            <Card.Title className="empty-cart-title">Your cart is empty</Card.Title>
            <Button variant="primary" className="browse-btn" onClick={() => navigate('/dashboard')}>Browse Restaurants</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }


  return (
    <Container className="mt-5">
      <h1 className="cart-title mb-4">Your Cart</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <ListGroup variant="flush">
                {cartItems.map((cartItem) => (
                  <ListGroup.Item key={cartItem.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="dish-name">{cartItem.dish.name}</h5>
                      <p className="text-muted mb-0 quantity">Quantity: {cartItem.quantity}</p>
                    </div>
                    <div className="text-right">
                      <h5 className="price">${(cartItem.dish.price * cartItem.quantity).toFixed(2)}</h5>
                      <div className="btn-group">
                        <Button variant="outline-secondary" size="sm" className="quantity-btn" onClick={() => updateCartItems(cartItem.dish.id, cartItem.quantity - 1)}>-</Button>
                        <Button variant="outline-secondary" size="sm" className="quantity-btn" onClick={() => updateCartItems(cartItem.dish.id, cartItem.quantity + 1)}>+</Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h4 className="summary-title mb-3">Order Summary</h4>
              <div className="d-flex justify-content-between mb-3">
                <span className="summary-text">Subtotal:</span>
                <span className="summary-price">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="summary-text">Delivery Fee:</span>
                <span className="summary-price">$2.99</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong className="summary-text">Total:</strong>
                <strong className="summary-price">${(totalPrice + 2.99).toFixed(2)}</strong>
              </div>
              <Form>
                <Form.Group className="mb-3">
                  <PlacesAutocomplete
                    value={deliveryAddress}
                    onChange={setDeliveryAddress}
                    onSelect={handleSelect}
                  >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div>
                        <Form.Control
                          {...getInputProps({
                            placeholder: 'Enter delivery address',
                          })}
                          className="address-input"
                        />
                        <div className="autocomplete-dropdown-container">
                          {loading && <div>Loading...</div>}
                          {suggestions.map(suggestion => (
                            <div
                              {...getSuggestionItemProps(suggestion)}
                              key={suggestion.placeId}
                              className="suggestion-item"
                            >
                              <FaMapMarkerAlt /> {suggestion.description}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Pick up instead of delivery"
                    checked={isPick}
                    onChange={(e) => setIsPick(e.target.checked)}
                    className="pickup-checkbox"
                  />
                </Form.Group>
                <Button
                  variant="success"
                  size="lg"
                  block
                  onClick={handlePlaceOrder}
                  disabled={deliveryAddress.trim() === ""}
                  className="place-order-btn"
                >
                  Place Order
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  block
                  onClick={() => navigate('/dashboard')}
                  className="back-to-dashboard-btn"
                >Back to Dashboard</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};


export default Cart;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import useCart from '../../hooks/useCart';
// import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
// import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
// import { FaMapMarkerAlt } from 'react-icons/fa';
// import '../../styles/Cart.css';
// import { baseUrl } from '../../services/api-services';

// const Cart = () => {
//   const [cartItems, totalPrice, updateCartItems] = useCart();
//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [isPick, setIsPick] = useState(false);
//   const navigate = useNavigate();
//   const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

//   const handlePlaceOrder = async () => {
//     try {
//       const token = localStorage.getItem('access_token');
//       const orderData = {
//         delivery_address: deliveryAddress,
//         is_pick: isPick,
//       };

//       const response = await axios.post(`${baseUrl}/api/orders/create/`, orderData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       alert(`Order placed: ${response.data.order_id}`);
//       navigate('/customer-orders');
//     } catch (error) {
//       console.error("Error placing order:", error);
//     }
//   };

//   const handleSelect = async (value) => {
//     const results = await geocodeByAddress(value);
//     const latLng = await getLatLng(results[0]);
//     setDeliveryAddress(value);
//     setCoordinates(latLng);
//   };

//   if (!cartItems || cartItems.length === 0) {
//     return (
//       <Container className="mt-5">
//         <Card className="text-center">
//           <Card.Body>
//             <Card.Title className="empty-cart-title">Your cart is empty</Card.Title>
//             <Button variant="primary" className="browse-btn" onClick={() => navigate('/dashboard')}>Browse Restaurants</Button>
//           </Card.Body>
//         </Card>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-5">
//       <h1 className="cart-title mb-4">Your Cart</h1>
//       <Row>
//         <Col md={8}>
//           <Card className="mb-4">
//             <Card.Body>
//               <ListGroup variant="flush">
//                 {cartItems.map((cartItem) => (
//                   <ListGroup.Item key={cartItem.id} className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <h5 className="dish-name">{cartItem.dish.name}</h5>
//                       <p className="text-muted mb-0 quantity">Quantity: {cartItem.quantity}</p>
//                     </div>
//                     <div className="text-right">
//                       <h5 className="price">${(cartItem.dish.price * cartItem.quantity).toFixed(2)}</h5>
//                       <div className="btn-group">
//                         <Button variant="outline-secondary" size="sm" className="quantity-btn" onClick={() => updateCartItems(cartItem.dish.id, cartItem.quantity - 1)}>-</Button>
//                         <Button variant="outline-secondary" size="sm" className="quantity-btn" onClick={() => updateCartItems(cartItem.dish.id, cartItem.quantity + 1)}>+</Button>
//                       </div>
//                     </div>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={4}>
//           <Card>
//             <Card.Body>
//               <h4 className="summary-title mb-3">Order Summary</h4>
//               <div className="d-flex justify-content-between mb-3">
//                 <span className="summary-text">Subtotal:</span>
//                 <span className="summary-price">${totalPrice.toFixed(2)}</span>
//               </div>
//               <div className="d-flex justify-content-between mb-3">
//                 <span className="summary-text">Delivery Fee:</span>
//                 <span className="summary-price">$2.99</span>
//               </div>
//               <hr />
//               <div className="d-flex justify-content-between mb-3">
//                 <strong className="summary-text">Total:</strong>
//                 <strong className="summary-price">${(totalPrice + 2.99).toFixed(2)}</strong>
//               </div>
//               <Form>
//                 <Form.Group className="mb-3">
//                   <PlacesAutocomplete
//                     value={deliveryAddress}
//                     onChange={setDeliveryAddress}
//                     onSelect={handleSelect}
//                   >
//                     {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
//                       <div>
//                         <Form.Control
//                           {...getInputProps({
//                             placeholder: 'Enter delivery address',
//                           })}
//                           className="address-input"
//                         />
//                         <div className="autocomplete-dropdown-container">
//                           {loading && <div>Loading...</div>}
//                           {suggestions.map(suggestion => (
//                             <div
//                               {...getSuggestionItemProps(suggestion)}
//                               key={suggestion.placeId}
//                               className="suggestion-item"
//                             >
//                               <FaMapMarkerAlt /> {suggestion.description}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </PlacesAutocomplete>
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Check
//                     type="checkbox"
//                     label="Pick up instead of delivery"
//                     checked={isPick}
//                     onChange={(e) => setIsPick(e.target.checked)}
//                     className="pickup-checkbox"
//                   />
//                 </Form.Group>
//                 <Button
//                   variant="success"
//                   size="lg"
//                   block
//                   onClick={handlePlaceOrder}
//                   disabled={deliveryAddress.trim() === ""}
//                   className="place-order-btn"
//                 >
//                   Place Order
//                 </Button>
//                 <Button
//                   variant="secondary"
//                   size="lg"
//                   block
//                   onClick={() => navigate('/dashboard')}
//                   className="back-to-dashboard-btn" // Add a custom class for styling
//                 >Back to Dashboard</Button>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Cart;