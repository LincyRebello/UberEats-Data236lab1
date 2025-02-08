//usecart.js
"use client";
import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, selectTotalPrice, updateCartItem } from '../slices/orderSlice';
import { baseUrl } from '../services/api-services';


export default function useCart() {
   const [cartItems, setCartItems] = useState([]);
   const dispatch = useDispatch();
   const reduxCartItems = useSelector(selectCart);
   const reduxTotalPrice = useSelector(selectTotalPrice);


   useEffect(() => {
       fetchCartItems()
   }, []);


   const fetchCartItems = async () => {
       const token = localStorage.getItem('access_token');
       try {
           const response = await axios.get(`${baseUrl}/api/orders/cart-items/`, {
               headers: {
                   Authorization: `Bearer ${token}`,
               },
           });
           setCartItems(response.data);
           // Update Redux state with fetched cart items
           dispatch(updateCartItem({ items: response.data }));
       } catch (error) {
           console.error('Error fetching cart items profile:', error);
       }
   };


   const totalPrice = useMemo(() => {
       var totalPrice = 0;
       for (let cartItem of cartItems) {
           totalPrice += cartItem.dish.price * cartItem.quantity;
       }
       return totalPrice;
   }, [cartItems]);


   const updateCartItems = async (dish_id, quantity) => {
       const token = localStorage.getItem('access_token');
       try {
           const response = axios.post(`${baseUrl}/api/orders/cart-items/`, {
               "dish_id": dish_id,
               "quantity": quantity > 0 ? quantity : 0
           }, {
               headers: {
                   Authorization: `Bearer ${token}`,
               },
           });
           setCartItems((cartItems) => {
               var cartItemIndex = cartItems.findIndex(cartItem => cartItem.dish.id == dish_id);
               let newCartItems;
               if (quantity > 0) {
                   if (cartItemIndex != -1) {
                       newCartItems = [
                           ...cartItems.slice(0, cartItemIndex),
                           {
                               ...cartItems[cartItemIndex],
                               quantity: quantity
                           },
                           ...cartItems.slice(cartItemIndex + 1)
                       ];
                   } else {
                       newCartItems = [
                           ...cartItems,
                           {
                               dish: { id: dish_id },
                               quantity: quantity
                           }
                       ];
                   }
               } else if (cartItemIndex != -1) {
                   newCartItems = [
                       ...cartItems.slice(0, cartItemIndex),
                       ...cartItems.slice(cartItemIndex + 1)
                   ];
               } else {
                   newCartItems = [...cartItems];
               }
               // Dispatch Redux action with updated cart items
               dispatch(updateCartItem({ dish_id, quantity }));
               return newCartItems;
           });
       } catch (error) {
           console.error('Error updating cart items:', error);
       }
   };


   return [cartItems, totalPrice, updateCartItems];
}
// "use client";
// import axios from 'axios';
// import {useState, useEffect, useMemo} from 'react'
// import { baseUrl } from '../services/api-services';

// export default function useCart(){
//     const [cartItems, setCartItems] = useState([]);
//     useEffect(() => {
//         fetchCartItems()
//       }, []);
    
//       const fetchCartItems = async () => {
//         const token = localStorage.getItem('access_token');
//         try {
//           const response = await axios.get(`${baseUrl}/api/orders/cart-items/`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           setCartItems(response.data)
//         } catch (error) {
//           console.error('Error fetching cart items profile:', error);
//         }
//       };
    
//       const totalPrice = useMemo(()=>{
//         var totalPrice = 0;
//         for(let cartItem of cartItems){
//             totalPrice+=cartItem.dish.price*cartItem.quantity
//         }
//         return totalPrice;
//       },[cartItems])
//       const updateCartItems = async (dish_id, quantity) => {
//         const token = localStorage.getItem('access_token');
//         try {
//           const response = axios.post(`${baseUrl}/api/orders/cart-items/`, {
//             "dish_id":dish_id,
//             "quantity":quantity>0?quantity:0
//           }, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           setCartItems((cartItems) => {
//             var cartItemIndex = cartItems.findIndex(cartItem=>cartItem.dish.id==dish_id);
//             if(quantity>0){
//               if(cartItemIndex!=-1){
//                 return [
//                   ...cartItems.slice(0,cartItemIndex),
//                   {
//                     ...cartItems[cartItemIndex],
//                     quantity:quantity
//                   },
//                   ...cartItems.slice(cartItemIndex+1)
//                 ]
//               }else{
//                 return [
//                     ...cartItems,
//                     {
//                       dish:{id:dish_id},
//                       quantity:quantity
//                     }
//                   ]
//               }
//             }else if(cartItemIndex!=-1){
//               return [
//                 ...cartItems.slice(0,cartItemIndex),
//                 ...cartItems.slice(cartItemIndex+1)
//               ]
//             }
//             return [...cartItems]
//           });
//         } catch (error) {
//           console.error('Error updating cart items:', error);
//         }
        
//       };
//       return [cartItems,totalPrice,updateCartItems]
// }