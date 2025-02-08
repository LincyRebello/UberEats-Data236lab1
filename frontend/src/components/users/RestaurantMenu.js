


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, selectAllRestaurants } from '../../slices/restaurantSlice';
import { addToCart, selectCart } from '../../slices/orderSlice';
import API_ENDPOINTS from '../../config';


const RestaurantMenu = () => {
   const { restaurantId } = useParams();
   const [dishes, setDishes] = useState([]);
   const dispatch = useDispatch();
   const cart = useSelector(selectCart);


   useEffect(() => {
       fetchMenu();
   }, []);


   const fetchMenu = async () => {
       try {
           const response = await axios.get(API_ENDPOINTS.RESTAURANT_DISHES(restaurantId));
           setDishes(response.data);
       } catch (error) {
           console.error("Error fetching menu:", error);
       }
   };


   const addToCart = (dish) => {
       dispatch(addToCart(dish));
   };


   const handlePlaceOrder = async () => {
       const orderItems = cart.map(item => ({ dish: item.id, quantity: 1 }));
       const orderData = {
           customer: 1,  // Replace with the actual customer ID
           restaurant: restaurantId,
           order_items: orderItems,
           delivery_address: "Customer's address"
       };
  
       try {
           await axios.post(API_ENDPOINTS.CREATE_ORDER, orderData);
           alert("Order placed successfully!");
           dispatch(clearCart());
       } catch (error) {
           console.error("Error placing order:", error);
       }
   };


   return (
       <div>
           <h2>Menu</h2>
           <ul>
               {dishes.map(dish => (
                   <li key={dish.id}>
                       <h3>{dish.name} - ${dish.price}</h3>
                       <p>{dish.ingredients}</p>
                       <button onClick={() => addToCart(dish)}>Add to Cart</button>
                   </li>
               ))}
           </ul>
           {cart.length > 0 && (
               <div>
                   <h3>Cart</h3>
                   <ul>
                       {cart.map((item, index) => (
                           <li key={index}>
                               {item.name} - ${item.price}
                           </li>
                       ))}
                   </ul>
                   <button onClick={handlePlaceOrder}>Place Order</button>
               </div>
           )}
       </div>
   );
};


export default RestaurantMenu;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import API_ENDPOINTS from '../../config';

// const RestaurantMenu = () => {
//     const { restaurantId } = useParams();
//     const [dishes, setDishes] = useState([]);
//     const [cart, setCart] = useState([]);

//     useEffect(() => {
//         fetchMenu();
//     }, []);

//     const fetchMenu = async () => {
//         try {
//             const response = await axios.get(API_ENDPOINTS.RESTAURANT_DISHES(restaurantId));
//             setDishes(response.data);
//         } catch (error) {
//             console.error("Error fetching menu:", error);
//         }
//     };

//     const addToCart = (dish) => {
//         setCart([...cart, dish]);
//     };

//     const handlePlaceOrder = async () => {
//         const orderItems = cart.map(item => ({ dish: item.id, quantity: 1 }));
//         const orderData = {
//             customer: 1,  // Replace with the actual customer ID
//             restaurant: restaurantId,
//             order_items: orderItems,
//             delivery_address: "Customer's address"
//         };
    
//         try {
//             await axios.post(API_ENDPOINTS.CREATE_ORDER, orderData);
//             alert("Order placed successfully!");
//             setCart([]);
//         } catch (error) {
//             console.error("Error placing order:", error);
//         }
//     };

//     return (
//         <div>
//             <h2>Menu</h2>
//             <ul>
//                 {dishes.map(dish => (
//                     <li key={dish.id}>
//                         <h3>{dish.name} - ${dish.price}</h3>
//                         <p>{dish.ingredients}</p>
//                         <button onClick={() => addToCart(dish)}>Add to Cart</button>
//                     </li>
//                 ))}
//             </ul>
//             {cart.length > 0 && (
//                 <div>
//                     <h3>Cart</h3>
//                     <ul>
//                         {cart.map((item, index) => (
//                             <li key={index}>
//                                 {item.name} - ${item.price}
//                             </li>
//                         ))}
//                     </ul>
//                     <button onClick={handlePlaceOrder}>Place Order</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RestaurantMenu;
