import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ProtectedRoute = () => {
  const { loggedIn, loading } = useAuth();

  // While checking session, you could show a spinner instead of nothing:
  if (loading) return null;

  return loggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
