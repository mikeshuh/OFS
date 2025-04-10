import React, { useState } from "react";
import { requestServer } from "../utils/Utility";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../components/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const ProductCardAdmin = ({ product }) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    price: product.price,
    pounds: product.pounds,
    quantity: product.quantity
  });

  const handleClick = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await requestServer(
        `${API_URL}/api/products/update-product/${product.productID}`,
        "PUT",
        token,
        {
          name: product.name,
          category: product.category,
          price: formData.price || product.price,
          pounds: formData.pounds || product.pounds,
          quantity: formData.quantity || product.quantity,
          imageBinary: product.imageBinary
        }
      );
      if (response.data?.success) {
        location.reload();
      } else {
        console.log(response.data?.message || response.message);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setEditMode(false);
    }
  };

  return (
    <div className="border-b border-[rgba(18,2,19,0.10)] flex items-center w-full">
      {/* Name Column (15%) */}
      <div className="w-[15%] pl-5 py-2 border-r border-[transparent]">
        <div className="text-[#120213] text-sm font-medium truncate">
          {product.name}
        </div>
      </div>

      {/* Category Column (15%) */}
      <div className="w-[15%] py-2 border-r border-[transparent]">
        <div className="text-[#120213] text-sm font-medium truncate">
          {product.category}
        </div>
      </div>

      {!editMode ? (
        <>
          {/* Price Column (15%) */}
          <div className="w-[15%] py-2 border-r border-[transparent]">
            <div className="text-[#120213] text-sm font-medium truncate">
              {product.price}
            </div>
          </div>

          {/* Pounds Column (15%) */}
          <div className="w-[15%] py-2 border-r border-[transparent]">
            <div className="text-[#120213] text-sm font-medium truncate">
              {product.pounds}
            </div>
          </div>

          {/* Quantity Column (15%) */}
          <div className="w-[15%] py-2 border-r border-[transparent]">
            <div className="text-[#120213] text-sm font-medium truncate">
              {product.quantity}
            </div>
          </div>

          {/* Edit Button (remaining space) */}
          <div className="flex-1 px-4">
            <button
              onClick={handleClick}
              className="text-[#329141] underline text-sm hover:text-[#276c30] transition-all"
            >
              Edit
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSave} className="flex items-center w-[65%]">
          {/* Editable Price (15%) */}
          <div className="w-[15%]">
            <input
              type="text"
              name="price"
              onChange={handleChange}
              value={formData.price}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          {/* Editable Pounds (15%) */}
          <div className="w-[15%] ml-15">
            <input
              type="text"
              name="pounds"
              onChange={handleChange}
              value={formData.pounds}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          {/* Editable Quantity (15%) */}
          <div className="w-[15%] ml-15">
            <input
              type="text"
              name="quantity"
              onChange={handleChange}
              value={formData.quantity}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          {/* Action Buttons (remaining space) */}
          <div className="flex gap-8 px-4">
            <button
              type="button"
              onClick={handleClick}
              className="ml-4 text-[#329141] underline text-sm hover:text-[#276c30] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-[#329141] underline text-sm hover:text-[#276c30] transition-all"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductCardAdmin;
