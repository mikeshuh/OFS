import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;
export const requestServer = async (url, method, token, data = {}, contentType = 'application/json') => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        'Content-Type': contentType,
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    return error.response || error;
  }
};

export const checkLogin = async () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    try {
      const decode = jwtDecode(token);
      const response = await requestServer(`${API_URL}/api/users/profile/${decode.id}`, "GET", token);
      return response.data?.success;
    } catch (error) {
      console.error("Login session expired:", error);
      return false;
    }
  } else {
    return false;
  }
};


