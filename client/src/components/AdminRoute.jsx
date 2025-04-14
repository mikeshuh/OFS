import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading, true = allowed, false = forbidden

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userProfile = JSON.parse(localStorage.getItem("userProfile"));
        if (!userProfile?.isAdmin) {
          window.alert("You are not authorized to access this page");
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error: ", error);
        window.alert("You are not authorized to access this page");
        setIsAuthorized(false);
      }
    };

    checkAdmin();
  }, []);

  // Could further add a loading icon or something, low priority
  if (isAuthorized === null) return null;

  return isAuthorized ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
