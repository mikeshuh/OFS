import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestServer } from "../utils/Utility";
const GetProductsContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

const GetProducts = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [item, setItem] = useState(localStorage.getItem("searchedItem"));
  const navigate = useNavigate();

  // logic to get profile
  const getProductMatch = async (data) => {
    try {
      const response = await requestServer(`${API_URL}/api/products/search/${data}`, "GET", token);
      if (response.data.data == null) {
        console.log("do nothing")
      } else {
        localStorage.setItem("itemData", JSON.stringify(response.data.data));
      }
      return response.data
    } catch (error) {
      console.error("Error fetching item", error);
      return error;
    }
  }

  return <GetProductsContext.Provider value={{ getProductMatch, token }}>{children}</GetProductsContext.Provider>;
};

export default GetProducts;

export const useGetProducts = () => {
  return useContext(GetProductsContext);
};
