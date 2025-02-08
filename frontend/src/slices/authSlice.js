import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
 token: localStorage.getItem('access_token'),
 user: null,
 userType: null,
 loading: false,
 error: null,
};


// Create axios instance with interceptors
const api = axios.create();


api.interceptors.request.use(
 (config) => {
   const token = localStorage.getItem('access_token');
   if (token) {
     config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
 },
 (error) => Promise.reject(error)
);


api.interceptors.response.use(
 (response) => response,
 async (error) => {
   const originalRequest = error.config;
  
   if (error.response?.status === 401 && !originalRequest._retry) {
     originalRequest._retry = true;
     try {
       const refresh = localStorage.getItem('refresh_token');
       const response = await axios.post('http://localhost:8080/api/token/refresh/', { refresh });
       localStorage.setItem('access_token', response.data.access);
       api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
       return api(originalRequest);
     } catch (err) {
       localStorage.removeItem('access_token');
       localStorage.removeItem('refresh_token');
       return Promise.reject(error);
     }
   }
   return Promise.reject(error);
 }
);


export const signupCustomer = createAsyncThunk(
 'auth/signupCustomer',
 async (formData, { rejectWithValue }) => {
   try {
     const response = await axios.post('http://localhost:8080/api/customers/register/', formData);
     return { ...response.data, userType: 'customer' };
   } catch (error) {
     return rejectWithValue('Signup failed. Please try again.');
   }
 }
);


export const signupRestaurant = createAsyncThunk(
 'auth/signupRestaurant',
 async (formData, { rejectWithValue }) => {
   try {
     const response = await axios.post('http://localhost:8080/api/restaurants/register/', formData);
     return { ...response.data, userType: 'restaurant' };
   } catch (error) {
     return rejectWithValue('Signup failed. Please check your inputs and try again.');
   }
 }
);




export const loginCustomer = createAsyncThunk(
 'auth/loginCustomer',
 async (credentials, { rejectWithValue }) => {
   try {
     const response = await api.post('http://localhost:8080/api/customers/login/', credentials);
     localStorage.setItem('access_token', response.data.access);
     localStorage.setItem('refresh_token', response.data.refresh);
     return { ...response.data, userType: 'customer' };
   } catch (error) {
     return rejectWithValue(error.response?.data?.detail || 'Invalid email or password');
   }
 }
);


export const loginRestaurant = createAsyncThunk(
 'auth/loginRestaurant',
 async (credentials, { rejectWithValue }) => {
   try {
     const response = await api.post('http://localhost:8080/api/restaurants/login/', credentials);
     localStorage.setItem('access_token', response.data.access);
     localStorage.setItem('refresh_token', response.data.refresh);
     return { ...response.data, userType: 'restaurant' };
   } catch (error) {
     return rejectWithValue(error.response?.data?.detail || 'Invalid email or password');
   }
 }
);


const authSlice = createSlice({
 name: 'auth',
 initialState,
 reducers: {
   logout: (state) => {
     state.token = null;
     state.user = null;
     state.userType = null;
     localStorage.removeItem('access_token');
     localStorage.removeItem('refresh_token');
   },
 },
 extraReducers: (builder) => {
   builder
     .addMatcher(
       (action) => action.type.endsWith('/pending'),
       (state) => {
         state.loading = true;
         state.error = null;
       }
     )
     .addMatcher(
       (action) => action.type.endsWith('/fulfilled'),
       (state, action) => {
         state.loading = false;
         state.token = action.payload.access;
         state.user = action.payload.user;
         state.userType = action.payload.userType;
       }
     )
     .addMatcher(
       (action) => action.type.endsWith('/rejected'),
       (state, action) => {
         state.loading = false;
         state.error = action.payload;
         state.token = null;
         state.user = null;
       }
     );
 },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;


export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectUserType = (state) => state.auth.userType;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;