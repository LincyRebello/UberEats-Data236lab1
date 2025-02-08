// App.js
import React from 'react';
import './App.css';
import Router from './Router';  // Import the Router component
import { FavoritesProvider } from './components/users/FavoritesContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux'; // Import the Provider
import store from './store';  // Import the store

function App() {
  return (
    <Provider store={store}> 
      <FavoritesProvider>
        <Router />  {/* Use the Router component here */}
      </FavoritesProvider>
    </Provider>
  );
}

export default App;


// import React from 'react';
// import './App.css';
// import AppNavbar from './components/users/AppNavbar'; 
// import Home from './components/common/Home';
// import CustomerSignup from './components/users/CustomerSignup';
// import RestaurantSignup from './components/users/RestaurantSignup';
// import Login from './components/users/Login';
// import Profile from './components/users/Profile';
// import Dashboard from './components/users/Dashboard';
// import FavoritesPage from './components/users/FavoritesPage';
// import RestaurantDetail from './components/RestaurantDetail';
// import Cart from './components/users/Cart';
// import RestaurantLogin from './components/users/RestaurantLogin';
// import OrderHistory from './components/users/OrderHistory'; // Ensure this import is correct
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';  // Import for the new setup
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { FavoritesProvider } from './components/users/FavoritesContext'; 

// // Define your routes in an array of objects
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/signup/customer",
//     element: <CustomerSignup />,
//   },
//   {
//     path: "/login/customer",
//     element: <Login />,
//   },
//   {
//     path: "/signup/restaurant",
//     element: <RestaurantSignup />,
//   },
//   {
//     path: "/login/restaurant",
//     element: <RestaurantLogin />,
//   },
//   {
//     path: "/dashboard",
//     element: <Dashboard />,
//   },
//   {
//     path: "/cart",
//     element: <Cart />,
//   },
//   {
//     path: "/order-history/:customerId",
//     element: <OrderHistory />,
//   },
//   {
//     path: "/restaurant/:restaurantId",
//     element: <RestaurantDetail />,
//   },
//   {
//     path: "/favorites",
//     element: <FavoritesPage />,
//   },
//   {
//     path: "/profile/customer/:customerId",
//     element: <Profile userType="customer" />,
//   },
//   {
//     path: "/profile/restaurant/:restaurantId",
//     element: <Profile userType="restaurant" />,
//   }
// ]);

// function App() {
//   return (
//     <FavoritesProvider>
//       <AppNavbar /> 
//       {/* Use RouterProvider with the router */}
//       <RouterProvider router={router} />
//     </FavoritesProvider>
//   );
// }

// export default App;
