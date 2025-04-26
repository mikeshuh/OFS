// src/utils/Utility.jsx
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// baseURL & cookies
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// 2) CSRF interceptor: read the XSRF-TOKEN cookie and set header on mutating requests
axios.interceptors.request.use(config => {
  if (config.method && config.method.toLowerCase() !== 'get') {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
      config.headers['X-CSRF-Token'] = match[1];
    }
  }
  return config;
});

export const requestServer = async (
  url,
  method,
  data = {},
  contentType = 'application/json'
) => {
  try {
    const response = await axios({
      url,
      method,
      data,
      headers: { 'Content-Type': contentType }
    });
    return response;
  } catch (error) {
    // return your standardized response object or the raw error
    return error.response || error;
  }
};
