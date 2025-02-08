import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCart } from '../../slices/orderSlice';
import API_ENDPOINTS from '../../config';


const OrderHistory = () => {
    const { customerId } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const cart = useSelector(selectCart);


    useEffect(() => {
        fetchOrderHistory();
    }, []);


    const fetchOrderHistory = async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/customers/${customerId}/orders/`);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching order history:", error);
            setError('Failed to load order history.');
            setLoading(false);
        }
    };


    if (loading) {
        return <p>Loading order history...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    return (
        <div>
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            <h3>Order #{order.id} - {order.status}</h3>
                            <p>Restaurant: {order.restaurant.name}</p>
                            <p>Delivery Address: {order.delivery_address}</p>
                            <h4>Items:</h4>
                            <ul>
                                {order.order_items.map(item => (
                                    <li key={item.id}>
                                        {item.quantity} x {item.dish.name} - ${item.dish.price}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default OrderHistory;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';  // Use useParams to get customerId from the URL
// import API_ENDPOINTS from '../../config';

// const OrderHistory = () => {
//     const { customerId } = useParams();  // Extract customerId from the URL
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);  // Add loading state
//     const [error, setError] = useState(null);  // Add error state

//     useEffect(() => {
//         fetchOrderHistory();
//     }, []);

//     const fetchOrderHistory = async () => {
//         try {
//             const response = await axios.get(`${API_ENDPOINTS.BASE_URL}/customers/${customerId}/orders/`);
//             setOrders(response.data);
//             setLoading(false);  // Set loading to false after fetching
//         } catch (error) {
//             console.error("Error fetching order history:", error);
//             setError('Failed to load order history.');
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <p>Loading order history...</p>;  // Display loading message
//     }

//     if (error) {
//         return <p>{error}</p>;  // Display error message if error occurred
//     }

//     return (
//         <div>
//             <h2>Order History</h2>
//             {orders.length === 0 ? (
//                 <p>No orders found.</p>  // Display message if no orders are found
//             ) : (
//                 <ul>
//                     {orders.map(order => (
//                         <li key={order.id}>
//                             <h3>Order #{order.id} - {order.status}</h3>
//                             <p>Restaurant: {order.restaurant.name}</p>
//                             <p>Delivery Address: {order.delivery_address}</p>
//                             <h4>Items:</h4>
//                             <ul>
//                                 {order.order_items.map(item => (
//                                     <li key={item.id}>
//                                         {item.quantity} x {item.dish.name} - ${item.dish.price}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default OrderHistory;
