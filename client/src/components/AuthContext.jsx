import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestServer, PORT } from "../utils/Utility";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [loggedIn, setLoggedIn] = useState(!!token);
  const navigate = useNavigate();

  // Check if the user is logged in
  // If not, direct them to the login page
  const checkLogin = async () => {
    try {
      const decode = jwtDecode(token);
      const response = await requestServer(`http://localhost:5000/api/users/profile/${decode.id}`, "GET", token);
      if (!response.data?.success) {
        navigate("/login");
      };
      return response;
    } catch (error) {
      console.error("Login session expired:", error);
      return error;
    }
  }

  // logic for login
  const loginAction = async (data) => {
    try {
      const response = await requestServer("http://localhost:5000/api/users/login", "POST", "", data);
      if (response.data?.success) {
        const data = response.data;
        localStorage.setItem("authToken", data.data?.token);
        setToken(data.data?.token);
        setLoggedIn(true);
        navigate("/profile");
      }
      return response;
    } catch (err) {
      window.alert("Error: ", err);
      return err;
    }
  };

  // logic for logout
  const logOut = () => {
    window.alert("You have been logged out successfully.");
    navigate("/login");
    setUser(null);
    setToken("");
    setLoggedIn(false);
    localStorage.removeItem("authToken");
  };

  // logic to get profile
  const getProfile = async () => {
    try {
      const decode = jwtDecode(token);
      const response = await requestServer(`http://localhost:5000/api/users/profile/${decode.id}`, "GET", token);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile", error);
      return error;
    }
  }

  const changePassword = async (data) => {
    try {
      const decode = jwtDecode(token);
      const response = await requestServer(`http://localhost:5000/api/users/change-password/${decode.id}`, "PUT", token, data);
      if(response.data?.success) {
        window.alert("Password changed successfully");
        navigate("/login");
      }else{
        return response;
      }
    } catch (error) {
      console.error("Error changing password", error);
      return error;
    }
  }
  return <AuthContext.Provider value={{ changePassword,token, loggedIn, user, checkLogin, loginAction, logOut, getProfile }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
