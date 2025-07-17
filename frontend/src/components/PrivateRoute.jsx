import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles, children }) => {
  // Check if user is logged in
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If there are children, render them, otherwise render the outlet
  return children ? children : <Outlet />;
};

export default PrivateRoute;