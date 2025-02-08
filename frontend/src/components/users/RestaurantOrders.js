import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, ListGroup, Form, Button } from 'react-bootstrap';
import { FaUtensils, FaShoppingBag, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderStatus, selectOrderStatus } from '../../slices/orderSlice';
import '../../styles/RestaurantOrders.css';
import { baseUrl } from '../../services/api-services';
import WebSocketProvider from '../common/WebSocketProvider';


const RestaurantOrders = () => {
 const [orders, setOrders] = useState([]);
 const dispatch = useDispatch();
 const orderStatus = useSelector(selectOrderStatus);


 useEffect(() => {
   fetchOrderItems()
 }, []);


 const fetchOrderItems = async () => {
   const token = localStorage.getItem('access_token');
   try {
     const response = await axios.get(`${baseUrl}/api/orders/restaurant-orders/`, {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });
     setOrders(response.data)
   } catch (error) {
     console.error('Error fetching orders:', error);
   }
 };


 const onChangeOrder = async (order_id, status) => {
   const token = localStorage.getItem('access_token');
   try {
     const response = await axios.patch(`${baseUrl}/api/orders/restaurant-orders/${order_id}/change-status/`, {
       status: status
     }, {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });
     setOrders(response.data);
     dispatch(updateOrderStatus(status));
   } catch (error) {
     console.error('Error changing order status:', error);
   }
 }


 if (!orders || orders.length === 0) {
   return (
     <Container className="mt-5">
       <Card className="text-center">
         <Card.Body>
           <Card.Title>No orders available</Card.Title>
         </Card.Body>
       </Card>
     </Container>
   );
 }


 const callback = (message) => {
   console.log(message);
   if(message?.message_type=='create_order'){
     alert("You have received new order.");
     fetchOrderItems();
   }
 }


 return (
   <>
   <Container className="mt-5">
     <h1 className="mb-4">Restaurant Orders</h1>
     <Row>
       {orders.map((order) => (
         <Col key={order.id} xs={12} md={6} lg={4} className="mb-4">
           <OrderItem order={order} onChangeOrder={onChangeOrder} />
         </Col>
       ))}
     </Row>
   </Container>
   <WebSocketProvider callback={callback}/>
   </>
 );
};


// Keep the OrderItem component and getStatusColor function exactly the same
const OrderItem = ({ order, onChangeOrder }) => {
 const [status, setStatus] = useState();
 const statusList = ["", "New", "Preparing", "Ready to pick", "On the Way", "Delivered", "Cancelled"];


 return (
   <Card className="h-100">
     <Card.Header className="d-flex justify-content-between align-items-center">
       <span className="order-id">Order #{order.order_id}</span>
       <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
     </Card.Header>
     <Card.Body>
       <Card.Title className="customer-name">
         <FaUser className="me-2" />
         {order.customer.name}
       </Card.Title>
       <Card.Text className="address">
         <FaMapMarkerAlt className="me-2" />
         {order.delivery_address}
       </Card.Text>
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
       <Form className="mt-3">
         <Form.Group className="mb-3">
           <Form.Label>Update Status:</Form.Label>
           <Form.Select
             value={status}
             onChange={(e) => setStatus(e.target.value)}
             className="mb-2"
           >
             {statusList.map((statusOption) => (
               <option
                 value={statusOption}
                 key={statusOption}
               >
                 {statusOption}
               </option>
             ))}
           </Form.Select>
         </Form.Group>
         <Button
           variant="primary"
           onClick={() => onChangeOrder(order.order_id, status)}
           disabled={status === ""}
         >
           Update Status
         </Button>
       </Form>
     </Card.Body>
   </Card>
 );
}


const getStatusColor = (status) => {
 switch (status) {
   case 'Delivered':
     return 'success';
   case 'Cancelled':
     return 'danger';
   case 'Preparing':
     return 'warning';
   case 'On the Way':
     return 'info';
   default:
     return 'primary';
 }
};


export default RestaurantOrders;

// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { Container, Row, Col, Card, Badge, ListGroup, Form, Button } from 'react-bootstrap';
// import { FaUtensils, FaShoppingBag, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
// import '../../styles/RestaurantOrders.css';
// import { baseUrl } from '../../services/api-services';
// import WebSocketProvider from '../common/WebSocketProvider';

// const RestaurantOrders = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     fetchOrderItems()
//   }, []);

//   const fetchOrderItems = async () => {
//     const token = localStorage.getItem('access_token');
//     try {
//       const response = await axios.get(`${baseUrl}/api/orders/restaurant-orders/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setOrders(response.data)
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     }
//   };

//   const onChangeOrder = async (order_id, status) => {
//     const token = localStorage.getItem('access_token');
//     try {
//       const response = await axios.patch(`${baseUrl}/api/orders/restaurant-orders/${order_id}/change-status/`, {
//         status: status
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setOrders(response.data)
//     } catch (error) {
//       console.error('Error changing order status:', error);
//     }
//   }

//   if (!orders || orders.length === 0) {
//     return (
//       <Container className="mt-5">
//         <Card className="text-center">
//           <Card.Body>
//             <Card.Title>No orders available</Card.Title>
//           </Card.Body>
//         </Card>
//       </Container>
//     );
//   }
//   const callback = (message)=>{
//     console.log(message);
//     if(message?.message_type=='create_order'){
//       alert("You have received new order.");
//       fetchOrderItems();
//     }
//   }

//   return (
//     <>
//     <Container className="mt-5">
//       <h1 className="mb-4">Restaurant Orders</h1>
//       <Row>
//         {orders.map((order) => (
//           <Col key={order.id} xs={12} md={6} lg={4} className="mb-4">
//             <OrderItem order={order} onChangeOrder={onChangeOrder} />
//           </Col>
//         ))}
//       </Row>
//     </Container>
//     <WebSocketProvider callback={callback}/>
//     </>
//   );
// };

// const OrderItem = ({ order, onChangeOrder }) => {
//   const [status, setStatus] = useState();
//   const statusList = ["", "New", "Preparing", "Ready to pick", "On the Way", "Delivered", "Cancelled"];

//   return (
//     <Card className="h-100">
//       <Card.Header className="d-flex justify-content-between align-items-center">
//         <span className="order-id">Order #{order.order_id}</span>
//         <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
//       </Card.Header>
//       <Card.Body>
//         <Card.Title className="customer-name">
//           <FaUser className="me-2" />
//           {order.customer.name}
//         </Card.Title>
//         <Card.Text className="address">
//           <FaMapMarkerAlt className="me-2" />
//           {order.delivery_address}
//         </Card.Text>
//         <ListGroup variant="flush">
//           {order.order_items.map((order_item) => (
//             <ListGroup.Item key={order_item.id} className="d-flex justify-content-between align-items-center">
//               <span>{order_item.dish.name}</span>
//               <Badge bg="secondary" pill>x{order_item.quantity}</Badge>
//             </ListGroup.Item>
//           ))}
//         </ListGroup>
//         <Card.Text className="mt-3 total-price">
//           <FaShoppingBag className="me-2" />
//           Total: ${order.total_price}
//         </Card.Text>
//         <Form className="mt-3">
//           <Form.Group className="mb-3">
//             <Form.Label>Update Status:</Form.Label>
//             <Form.Select 
//               value={status} 
//               onChange={(e) => setStatus(e.target.value)}
//               className="mb-2"
//             >
//               {statusList.map((statusOption) => (
//                 <option 
//                   value={statusOption} 
//                   key={statusOption}
//                 >
//                   {statusOption}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//           <Button 
//             variant="primary" 
//             onClick={() => onChangeOrder(order.order_id, status)} 
//             disabled={status === ""}
//           >
//             Update Status
//           </Button>
//         </Form>
//       </Card.Body>
//     </Card>
//   );
// }

// const getStatusColor = (status) => {
//   switch (status) {
//     case 'Delivered':
//       return 'success';
//     case 'Cancelled':
//       return 'danger';
//     case 'Preparing':
//       return 'warning';
//     case 'On the Way':
//       return 'info';
//     default:
//       return 'primary';
//   }
// };

// export default RestaurantOrders;
