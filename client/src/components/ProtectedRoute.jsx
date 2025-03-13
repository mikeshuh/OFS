import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const ProtectedRoute = () => {
  const user = useAuth();
  window.console.log("User: ", user);
  if (!user.token) {
    window.alert("Please login to access this page");
    return <Navigate to="/login" />
  };
  return <Outlet />;
};

export default ProtectedRoute;
