import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestServer, PORT } from "../utils/Utility";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
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
  // logic to get profile
  const getProfile = async (token) => {
    try {
      const decode = jwtDecode(token);
      const response = await requestServer(`http://localhost:5000/api/users/profile/${decode.id}`, "GET", token);
      localStorage.setItem("userProfile", JSON.stringify(response.data.data));
    } catch (error) {
      console.error("Error fetching profile", error);
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
        console.log(data.data?.token);
        setToken(data.data?.token);
        await getProfile(data.data?.token);

        await setLoggedIn(true);
        navigate("/profile");
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
      const response = await requestServer("http://localhost:5000/api/users/logout", "POST", token);
      if (response.data?.success) {
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
      const response = await requestServer(`http://localhost:5000/api/users/change-password/${decode.id}`, "PUT", token, data);
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
  return <AuthContext.Provider value={{ changePassword, token, loggedIn, checkLogin, loginAction, logOut, getProfile }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
