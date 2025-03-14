import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export const requestServer = async (url_, method_, token_, data_ = {}) => {
  try {
    console.log(url_, method_, token_, data_);
    const response = await axios({
      method: method_,
      url: url_,
      data: data_,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token_}`
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
      const response = await requestServer(`http://localhost:5000/api/users/profile/${decode.id}`, "GET", token);
      return response.data?.success;
    } catch (error) {
      console.error("Login session expired:", error);
      return false;
    }
  } else {
    return false;
  }
};

