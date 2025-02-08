import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch } from 'react-redux';

// Existing thunks
export const fetchOrders = createAsyncThunk(
 'order/fetchOrders',
 async () => {
   const token = localStorage.getItem('access_token');
   const response = await axios.get('http://localhost:8080/api/orders/restaurant-orders/', {
     headers: { Authorization: `Bearer ${token}` },
   });
   return response.data;
 }
);


export const updateOrderStatus = createAsyncThunk(
 'order/updateOrderStatus',
 async ({ orderId, status }) => {
   const token = localStorage.getItem('access_token');
   const response = await axios.patch(`http://localhost:8080/api/orders/restaurant-orders/${orderId}/change-status/`,
     { status },
     { headers: { Authorization: `Bearer ${token}` } }
   );
   return response.data;
 }
);


// New thunks
export const fetchCartItems = createAsyncThunk(
 'order/fetchCartItems',
 async () => {
   const token = localStorage.getItem('access_token');
   const response = await axios.get(`http://localhost:8080/api/orders/cart-items/`, {
     headers: { Authorization: `Bearer ${token}` },
   });
   return response.data;
 }
);


export const updateCartItem = createAsyncThunk(
 'order/updateCartItem',
 async ({ dish_id, quantity }) => {
   const token = localStorage.getItem('access_token');
   const response = await axios.post(
     `http://localhost:8080/api/orders/cart-items/`,
     { dish_id, quantity: quantity > 0 ? quantity : 0 },
     { headers: { Authorization: `Bearer ${token}` } }
   );
   return { dish_id, quantity };
 }
);


export const fetchCustomerOrders = createAsyncThunk(
 'order/fetchCustomerOrders',
 async () => {
   const token = localStorage.getItem('access_token');
   const response = await axios.get(`http://localhost:8080/api/orders/customer-orders/`, {
     headers: { Authorization: `Bearer ${token}` },
   });
   return response.data;
 }
);


export const cancelOrder = createAsyncThunk(
 'order/cancelOrder',
 async (order_id) => {
   const token = localStorage.getItem('access_token');
   const response = await axios.patch(
     `http://localhost:8080/api/orders/customer-orders/${order_id}/cancel-order/`,
     {},
     { headers: { Authorization: `Bearer ${token}` } }
   );
   return response.data;
 }
);

//const dispatch = useDispatch();
export const createOrder = createAsyncThunk(
 'order/createOrder',
 async (orderData) => {
   const token = localStorage.getItem('access_token');
   const response = await axios.post('http://localhost:8080/api/orders/create/', orderData, {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json',
     },
   });
   //await dispatch(fetchCustomerOrders());
   return response.data;
 }
);


const initialState = {
 cart: [],
 orders: [],
 customerOrders: [],
 status: 'idle',
 error: null,
};


const orderSlice = createSlice({
 name: 'order',
 initialState,
 reducers: {
   clearCart: (state) => {
     state.cart = [];
   },
 },
 extraReducers: (builder) => {
   builder
     .addCase(fetchOrders.pending, (state) => {
       state.status = 'loading';
     })
     .addCase(fetchOrders.fulfilled, (state, action) => {
       state.status = 'succeeded';
       state.orders = action.payload;
     })
     .addCase(fetchOrders.rejected, (state, action) => {
       state.status = 'failed';
       state.error = action.error.message;
     })
     .addCase(updateOrderStatus.fulfilled, (state, action) => {
       const index = state.orders.findIndex(order => order.id === action.payload.id);
       if (index !== -1) {
         state.orders[index] = action.payload;
       }
     })
     .addCase(fetchCartItems.fulfilled, (state, action) => {
       state.cart = action.payload;
     })
     .addCase(updateCartItem.fulfilled, (state, action) => {
       const { dish_id, quantity } = action.payload;
       const existingItem = state.cart.find(item => item.dish.id === dish_id);
       if (existingItem) {
         if (quantity > 0) {
           existingItem.quantity = quantity;
         } else {
           state.cart = state.cart.filter(item => item.dish.id !== dish_id);
         }
       } else if (quantity > 0) {
         state.cart.push({ dish: { id: dish_id }, quantity });
       }
     })
     .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        console.log("fetchCustomerOrders.fulfilled", action.payload);
       state.customerOrders = action.payload;
     })
     .addCase(cancelOrder.fulfilled, (state, action) => {
       state.customerOrders = action.payload;
     })
     .addCase(createOrder.fulfilled, (state, action) => {
       // You might want to update the state here based on the created order
       // For now, we'll just clear the cart
       state.cart = [];
     });
 },
});


export const { clearCart } = orderSlice.actions;
export default orderSlice.reducer;


export const selectCart = (state) => state.order.cart;
export const selectOrders = (state) => state.order.orders;
export const selectCustomerOrders = (state) => state.order.customerOrders;
export const selectOrderStatus = (state) => state.order.status;
export const selectOrderError = (state) => state.order.error;
export const selectTotalPrice = (state) =>
 state.order.cart.reduce((total, item) => total + (item.dish.price * item.quantity), 0);