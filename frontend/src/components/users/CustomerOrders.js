import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { FaUtensils, FaShoppingBag, FaTimes } from 'react-icons/fa';
import '../../styles/CustomerOrders.css';
//import { baseUrl } from '../../services/api-services';
import { fetchCustomerOrders, cancelOrder, selectOrders, selectCustomerOrders } from '../../slices/orderSlice';


const CustomerOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectCustomerOrders);
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(fetchCustomerOrders());
  }, [dispatch]);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  const onCancelOrder = async (order_id) => {
    dispatch(cancelOrder(order_id));
  };


  if (!orders || orders.length === 0) {
    return (
      <Container className="mt-5">
        <Card className="text-center">
          <Card.Body>
            <Card.Title>Your order history is empty</Card.Title>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>Browse Restaurants</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }


  return (
    <Container className="mt-5">
      <h1 className="mb-4">Your Orders</h1>
      <Row>
        {orders.map((order) => (
          <Col key={order.id} xs={12} md={6} lg={4} className="mb-4">
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span className="order-id">Order #{order.order_id}</span>
                <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
              </Card.Header>
              <Card.Body>
                <Card.Title className="restaurant-name">
                  <FaUtensils className="me-2" />
                  {order.restaurant.name}
                </Card.Title>
                <ListGroup variant="flush">
                  {order.order_items.map((order_item) => (
                    <ListGroup.Item key={order_item.id} className="d-flex justify-content-between align-items-center">
                      <span>{order_item.dish.name}</span>
                      <Badge bg="secondary" pill>x{order_item.quantity}</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Card.Text className="mt-3 total-price">
                  <FaShoppingBag className="me-2" />
                  Total: ${order.total_price}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-end">
                {!["Delivered", "Cancelled"].includes(order.status) && (
                  <Button variant="danger" size="sm" onClick={() => onCancelOrder(order.order_id)}>
                    <FaTimes className="me-1" /> Cancel Order
                  </Button>
                )}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-4">
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </Container>
  );
};


const getStatusColor = (status) => {
  switch (status) {
    case 'Delivered':
      return 'success';
    case 'Cancelled':
      return 'danger';
    case 'Preparing':
      return 'warning';
    default:
      return 'info';
  }
};


export default CustomerOrders;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
// import { FaUtensils, FaShoppingBag, FaTimes } from 'react-icons/fa';
// import '../../styles/CustomerOrders.css'; // We'll create this CSS file for custom styles
// import { baseUrl } from '../../services/api-services';

// const CustomerOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchOrderItems();
//   }, []);

//   const fetchOrderItems = async () => {
//     const token = localStorage.getItem('access_token');
//     try {
//       const response = await axios.get(`${baseUrl}/api/orders/customer-orders/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setOrders(response.data);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     }
//   };

//   const onCancelOrder = async (order_id) => {
//     const token = localStorage.getItem('access_token');
//     try {
//       const response = await axios.patch(`${baseUrl}/api/orders/customer-orders/${order_id}/cancel-order/`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setOrders(response.data);
//     } catch (error) {
//       console.error('Error cancelling order:', error);
//     }
//   };

//   if (!orders || orders.length === 0) {
//     return (
//       <Container className="mt-5">
//         <Card className="text-center">
//           <Card.Body>
//             <Card.Title>Your order history is empty</Card.Title>
//             <Button variant="primary" onClick={() => navigate('/')}>Browse Restaurants</Button>
//           </Card.Body>
//         </Card>
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-5">
//       <h1 className="mb-4">Your Orders</h1>
//       <Row>
//         {orders.map((order) => (
//           <Col key={order.id} xs={12} md={6} lg={4} className="mb-4">
//             <Card className="h-100">
//               <Card.Header className="d-flex justify-content-between align-items-center">
//                 <span className="order-id">Order #{order.order_id}</span>
//                 <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
//               </Card.Header>
//               <Card.Body>
//                 <Card.Title className="restaurant-name">
//                   <FaUtensils className="me-2" />
//                   {order.restaurant.name}
//                 </Card.Title>
//                 <ListGroup variant="flush">
//                   {order.order_items.map((order_item) => (
//                     <ListGroup.Item key={order_item.id} className="d-flex justify-content-between align-items-center">
//                       <span>{order_item.dish.name}</span>
//                       <Badge bg="secondary" pill>x{order_item.quantity}</Badge>
//                     </ListGroup.Item>
//                   ))}
//                 </ListGroup>
//                 <Card.Text className="mt-3 total-price">
//                   <FaShoppingBag className="me-2" />
//                   Total: ${order.total_price}
//                 </Card.Text>
//               </Card.Body>
//               <Card.Footer className="text-end">
//                 {!["Delivered", "Cancelled"].includes(order.status) && (
//                   <Button variant="danger" size="sm" onClick={() => onCancelOrder(order.order_id)}>
//                     <FaTimes className="me-1" /> Cancel Order
//                   </Button>
//                 )}
//               </Card.Footer>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//       <div className="text-center mt-4">
//         <Button variant="primary" onClick={() => navigate('/dashboard')}>
//           Go to Dashboard
//         </Button>
//       </div>
//     </Container>
//   );
// };

// const getStatusColor = (status) => {
//   switch (status) {
//     case 'Delivered':
//       return 'success';
//     case 'Cancelled':
//       return 'danger';
//     case 'Preparing':
//       return 'warning';
//     default:
//       return 'info';
//   }
// };

// export default CustomerOrders;
