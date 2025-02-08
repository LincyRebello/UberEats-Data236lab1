import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchRestaurants = createAsyncThunk(
 'restaurant/fetchRestaurants',
 async () => {
   const response = await axios.get('http://localhost:8080/api/restaurants/');
   return response.data;
 }
);


export const fetchRestaurantById = createAsyncThunk(
 'restaurant/fetchRestaurantById',
 async (restaurantId) => {
   const response = await axios.get(`http://localhost:8080/api/restaurants/${restaurantId}/`);
   return response.data;
 }
);


export const fetchDishes = createAsyncThunk(
 'restaurant/fetchDishes',
 async (restaurantId) => {
   const response = await axios.get(`http://localhost:8080/api/restaurants/${restaurantId}/dishes/`);
   return response.data;
 }
);


const initialState = {
 restaurants: [],
 currentRestaurant: null,
 dishes: [],
 status: 'idle',
 error: null,
};


const restaurantSlice = createSlice({
 name: 'restaurant',
 initialState,
 reducers: {},
 extraReducers: (builder) => {
   builder
     .addCase(fetchRestaurants.pending, (state) => {
       state.status = 'loading';
     })
     .addCase(fetchRestaurants.fulfilled, (state, action) => {
       state.status = 'succeeded';
       state.restaurants = action.payload;
     })
     .addCase(fetchRestaurants.rejected, (state, action) => {
       state.status = 'failed';
       state.error = action.error.message;
     })
     .addCase(fetchRestaurantById.fulfilled, (state, action) => {
       state.currentRestaurant = action.payload;
     })
     .addCase(fetchDishes.fulfilled, (state, action) => {
       state.dishes = action.payload;
     });
 },
});


export default restaurantSlice.reducer;


export const selectAllRestaurants = (state) => state.restaurant.restaurants;
export const selectCurrentRestaurant = (state) => state.restaurant.currentRestaurant;
export const selectDishes = (state) => state.restaurant.dishes;
export const selectRestaurantStatus = (state) => state.restaurant.status;
export const selectRestaurantError = (state) => state.restaurant.error;