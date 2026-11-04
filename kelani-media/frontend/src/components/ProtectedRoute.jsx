import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if token exists in localStorage (adjust key if your auth uses a different key name)
  const token = localStorage.getItem('token');

  if (!token) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child component (e.g., Home or FriendsPage)
  return children;
};

export default ProtectedRoute;