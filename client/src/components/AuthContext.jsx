import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestServer } from "../utils/Utility";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [loggedIn, setLoggedIn] = useState(!!token);
  const navigate = useNavigate();

  // Create a reference to store cart functions
  const cartFunctions = {
    clearCart: null
  };

  // Function to register the clearCart function from the CartContext
  const registerCartFunctions = (clearCartFn) => {
    cartFunctions.clearCart = clearCartFn;
  };

  // Check if the user is logged in
  // If not, direct them to the login page
  const checkLogin = async () => {
    try {
      const decode = jwtDecode(token);
      const response = await requestServer(`${API_URL}/api/users/profile/${decode.id}`, "GET", token);
      if (!response.data?.success) {
        navigate("/login");
      };
      return response;
    } catch (error) {
      console.error("Login session expired:", error);
      return error;
    }
  }

  // logic to get profile
  const getProfile = async (token) => {
    try {
      const decode = jwtDecode(token);
      const response = await requestServer(`${API_URL}/api/users/profile/${decode.id}`, "GET", token);
      if (!response.data?.success) {
        throw new Error("Failed to fetch profile.");
      }
      localStorage.setItem("userProfile", JSON.stringify(response.data.data));
    } catch (error) {
      console.error("Error fetching profile", error);
      return error;
    }
  }

  // logic for login
  const loginAction = async (data) => {
    try {
      const response = await requestServer(`${API_URL}/api/users/login`, "POST", "", data);
      if (response.data?.success) {
        const token = response.data.data?.token;
        await getProfile(token);
        localStorage.setItem("authToken", token);
        setToken(token);
        setLoggedIn(true);
        navigate("/");
      }
      return response;
    } catch (error) {
      window.alert(`Error: ${error.message || error}`);
      return error;
    }
  };

  // logic for logout
  const logOut = async () => {
    try {
      const response = await requestServer(`${API_URL}/api/users/logout`, "POST", token);
      if (response.data?.success) {
        // Clear the cart when the user logs out
        if (cartFunctions.clearCart) {
          cartFunctions.clearCart();
        }
        window.alert("You have been logged out successfully.");
        setToken("");
        setLoggedIn(false);
        localStorage.clear();
        navigate("/login");
      }
      return response;
    } catch (error) {
      window.alert(`Error: ${error.message || error}`);
      return error;
    }
  };

  const changePassword = async (data) => {
    try {
      const decode = jwtDecode(token);
      const response = await requestServer(`${API_URL}/api/users/change-password/${decode.id}`, "PUT", token, data);
      if (response.data?.success) {
        // Clear the cart when the user changes password
        if (cartFunctions.clearCart) {
          cartFunctions.clearCart();
        }
        window.alert("Password changed successfully.");
        setToken("");
        setLoggedIn(false);
        localStorage.clear();
        navigate("/login");
      } else {
        throw new Error(response.data?.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password", error);
      return error.message || "An unexpected error occurred.";
    }
  }

  return (
    <AuthContext.Provider
      value={{
        changePassword,
        token,
        loggedIn,
        checkLogin,
        loginAction,
        logOut,
        getProfile,
        registerCartFunctions
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
