// Router.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppNavbar from "./components/users/AppNavbar";
import Home from "./components/common/Home";
import CustomerSignup from "./components/users/CustomerSignup";
import RestaurantSignup from "./components/users/RestaurantSignup";
import Login from "./components/users/Login";
import RestaurantLogin from "./components/users/RestaurantLogin";
import Profile from "./components/users/Profile";
import Dashboard from "./components/users/Dashboard";
import FavoritesPage from "./components/users/FavoritesPage";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/users/Cart";
import RestaurantDashboard from './components/users/RestaurantDashboard';
import OwnRestaurantDashboard from "./components/users/OwnRestaurantDashboard";

// ProtectedRoute component for routes that require authentication
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login/customer" />;
    }
    return children;
};

// Define your routes in Router.js
function Router() {
    return (
        <BrowserRouter>
            <AppNavbar />  {/* Ensure that AppNavbar is rendered on all routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup/customer" element={<CustomerSignup />} />
                <Route path="/signup/restaurant" element={<RestaurantSignup />} />
                <Route path="/login/customer" element={<Login />} />
                <Route path="/login/restaurant" element={<RestaurantLogin />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/cart" element={
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                    <ProtectedRoute>
                        <FavoritesPage />
                    </ProtectedRoute>
                } />
                <Route path="/profile/customer/:customerId" element={
                    <ProtectedRoute>
                        <Profile userType="customer" />
                    </ProtectedRoute>
                } />
                <Route path="/profile/restaurant/:restaurantId" element={
                    <ProtectedRoute>
                        <Profile userType="restaurant" />
                    </ProtectedRoute>
                } />
                <Route path="/restaurant/:restaurantId" element={
                    <ProtectedRoute>
                        <RestaurantDetail />
                    </ProtectedRoute>
                } />
                <Route path="/restaurant/dashboard" element={
                    <ProtectedRoute>
                        <OwnRestaurantDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/restaurant/:restaurantId/dashboard" element={
                    <ProtectedRoute>
                        <OwnRestaurantDashboard />
                    </ProtectedRoute>
                } />
                

                {/* Fallback route for undefined paths */}
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
