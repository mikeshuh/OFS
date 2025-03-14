import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;
const ProtectedRoute = () => {
  const user = useAuth();
  const token = user.token;
  if (!token) {
    window.alert("Please login to access this page");
    return <Navigate to="/login" />
  };
  async () => {
    try {
      const decode = jwtDecode(token);
      const response = await requestServer(`${API_URL}/api/users/profile/${decode.id}`, "GET", token);
      if (!response.data?.success) {
        console.log("Response: ", response);
        window.alert("Please login to access this page");
        return <Navigate to="/login" />
      };
    } catch {
      window.alert("Please login to access this page");
      return <Navigate to="/login" />
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
