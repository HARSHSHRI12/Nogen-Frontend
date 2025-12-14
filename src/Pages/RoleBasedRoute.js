// src/Pages/RoleBasedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ allowedRole, children }) => {
  // Try from localStorage first, fallback to sessionStorage
  let userData = null;
  const localData = localStorage.getItem("userData");
  const sessionData = sessionStorage.getItem("userData");
  
  try {
    userData = localData ? JSON.parse(localData) : (sessionData ? JSON.parse(sessionData) : null);
  } catch (error) {
    console.error('Failed to parse userData:', error);
    userData = null;
  }

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  const userRole = userData.role?.toLowerCase();
  const expectedRole = allowedRole.toLowerCase();

  if (userRole !== expectedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;
