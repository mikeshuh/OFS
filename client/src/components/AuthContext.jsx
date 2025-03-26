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
        const data = response.data;
        localStorage.setItem("authToken", data.data?.token);
        console.log(data.data?.token);
        setToken(data.data?.token);
        await getProfile(data.data?.token);
        setLoggedIn(true);
        navigate("/");
      }
      return response;
    } catch (err) {
      window.alert("Error: ", err);
      return err;
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
      }
      return response;
    } catch (err) {
      window.alert("Error: ", err);
      return err;
    }
  };

  const changePassword = async (data) => {
    try {
      const decode = jwtDecode(token);
      const response = await requestServer(`${API_URL}/api/users/change-password/${decode.id}`, "PUT", token, data);
      if (response.data?.success) {
        navigate("/login");
        setToken("");
        setLoggedIn(false);
        localStorage.clear();
        window.alert("Password changed successfully");
      } else {
        window.alert("Error changing password: ", response.data.message);
      }
    } catch (error) {
      console.error("Error changing password", error);
      return error;
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
