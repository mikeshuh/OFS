import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { requestServer } from "../utils/Utility";

const API_URL = import.meta.env.VITE_API_URL;

const ProtectedRoute = () => {
  const user = useAuth();
  const token = user.token;
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!token) {
          window.alert("Please login to access this page");
          setIsAuthorized(false);
          return;
        }
        const decode = jwtDecode(token);
        const response = await requestServer(`${API_URL}/api/users/profile/${decode.id}`, "GET", token);
        if (!response.data?.success) {
          window.alert("Please login to access this page");
          setIsAuthorized(false);
          return;
        }
        setIsAuthorized(true);
      } catch {
        window.alert("Please login to access this page");
        setIsAuthorized(false);
      }
    };
    checkAuth();
  }, [token]);

  if (isAuthorized === null) return null; // or a spinner

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
