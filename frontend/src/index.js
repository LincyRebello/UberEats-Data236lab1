import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "react-toastify/dist/ReactToastify.css";
import { FavoritesProvider } from './components/users/FavoritesContext'; // Import FavoritesProvider
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from './components/common/Home';
import Login from './components/users/Login';
import Profile from './components/users/Profile';
import CustomerSignup from './components/users/CustomerSignup';
import RestaurantSignup from './components/users/RestaurantSignup';
import Dashboard from './components/users/Dashboard';
import FavoritesPage from './components/users/FavoritesPage';
import RestaurantLogin from './components/users/RestaurantLogin';
// import RestaurantDashboard from './components/users/RestaurantDashboard';
import RestaurantDetail from './components/users/RestaurantDetail'; // Import RestaurantDetail
import OwnRestaurantDashboard from './components/users/OwnRestaurantDashboard';
import Cart from './components/users/Cart';
import CustomerOrders from './components/users/CustomerOrders';
import RestaurantOrders from './components/users/RestaurantOrders';
import { Provider } from 'react-redux'; // Import the Provider
import store from './store/store'; // Import the store

// Define the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login/customer",
    element: <Login />,
  },
  {
    path: "/login/restaurant",
    element: <RestaurantLogin />, 
  },
  {
    path: "/signup/customer",
    element: <CustomerSignup />,
  },
  {
    path: "/signup/restaurant",
    element: <RestaurantSignup />,
  },
  {
    path: "/profile",
    element: <Profile userType="customer" />,
  },
  {
    path: "/profile/customer/:customerId",
    element: <Profile userType="customer" />,
  },
  {
    path:"/restaurant/dashboard",
    element:<OwnRestaurantDashboard/>
  },
  {
    path: "/profile/restaurant/:restaurantId",
    element: <Profile userType="restaurant" />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/favorites",
    element: <FavoritesPage />,
  },
  {
    path:'/cart',
    element:<Cart/>
  },
  {
    path:'/customer-orders',
    element:<CustomerOrders/>
  },
  {
    path:'/restaurant-orders',
    element:<RestaurantOrders/>
  },
  {
    path: "/restaurant/:restaurantId",
    element: <RestaurantDetail />, // Added the RestaurantDetail route
  },
  {
    path: "/restaurant/:restaurantId/dashboard",
    element: <OwnRestaurantDashboard />,
  },
  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap the app in FavoritesProvider to make context available globally
root.render(
  <Provider store={store}>
    <FavoritesProvider> 
      <RouterProvider router={router} />
    </FavoritesProvider>
  </Provider>
);
