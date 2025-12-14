import React from "react";
import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ allowedRole, children }) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleBasedRoute;
