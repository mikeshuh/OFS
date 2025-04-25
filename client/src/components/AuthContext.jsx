import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestServer } from "../utils/Utility";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn]       = useState(false);
  const [loading, setLoading]         = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const navigate                      = useNavigate();

  // CartContext can register its clearCart function here
  const cartFunctions = { clearCart: null };
  const registerCartFunctions = fn => { cartFunctions.clearCart = fn; };

  // Fetch the profile from /api/users/profile
  const getProfile = async () => {
    try {
      const res = await requestServer("/api/users/profile", "GET");
      if (res.data?.success) {
        setUserProfile(res.data.data);
        localStorage.setItem("userProfile", JSON.stringify(res.data.data));
        return res.data.data;
      } else {
        throw new Error("Failed to fetch profile.");
      }
    } catch (err) {
      throw err;
    }
  };

  // On mount, check session validity
  useEffect(() => {
    getProfile()
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false))
      .finally(() => setLoading(false));
  }, []);

  // Login action
  const loginAction = async credentials => {
    try {
      const res = await requestServer("/api/users/login", "POST", credentials);
      if (res.data?.success) {
        setLoggedIn(true);
        await getProfile();
        navigate("/");
      } else {
        throw new Error(res.data?.errors?.errors[0].msg || res.data?.message || "Network error, please try again later.");
      }
      return res;
    } catch (err) {
      console.error("Login error:", err);
      return err.message;
    }
  };

  // Logout action
  const logOut = async () => {
    try {
      const res = await requestServer("/api/users/logout", "POST");
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Logout failed.");
      }
      window.alert("Logout successful.");
      // clear client state
      if (cartFunctions.clearCart) cartFunctions.clearCart();
      setLoggedIn(false);
      setUserProfile(null);
      localStorage.clear();
      navigate("/");
      return res;
    } catch (err) {
      console.error("Logout error:", err);
      window.alert("Logout failed. Please try again.");
    }
  };

  // Change password action
  const changePassword = async payload => {
    try {
      const res = await requestServer("/api/users/change-password", "PUT", payload);
      if (res.data?.success) {
        if (cartFunctions.clearCart) cartFunctions.clearCart();
        window.alert("Password changed successfully.");
        setLoggedIn(false);
        setUserProfile(null);
        localStorage.clear();
        navigate("/");
      } else {
        throw new Error(res.data?.errors?.errors[0].msg || res.data?.message || "Password change failed.");
      }
      return res;
    } catch (err) {
      console.error("Change password error:", err);
      return err.message;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        loading,
        userProfile,
        loginAction,
        logOut,
        changePassword,
        getProfile,
        registerCartFunctions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
