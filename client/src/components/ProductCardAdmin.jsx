import React, { useState } from "react";
import { requestServer } from "../utils/Utility";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ProductCardAdmin = ({ product }) => {
  const [editMode, setEditMode] = useState(false);
  const [productUpdated, setProductUpdated] = useState(product);
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
        product.pounds = formData.pounds;
        product.price = formData.price;
        product.quantity = formData.quantity;
      } else {
        console.log(response.data?.message || response.message);
        window.alert("Update failed, please try again.");
      }
    } catch (error) {
      window.alert("Update failed, please try again.");
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
          {/* Editable Price (max: 9999.99) */}
          <div className="w-[15%]">
            <input
              type="number"
              name="price"
              onChange={handleChange}
              value={formData.price}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              step="0.01"
              min="0"
              max="9999.99"
              onInput={(e) => {
                if (e.target.value > 9999.99) e.target.value = 9999.99;
              }}
            />
          </div>

          {/* Editable Pounds (max: 999.99) */}
          <div className="w-[15%] ml-15">
            <input
              type="number"
              name="pounds"
              onChange={handleChange}
              value={formData.pounds}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              step="0.01"
              min="0"
              max="999.99"
              onInput={(e) => {
                if (e.target.value > 999.99) e.target.value = 999.99;
              }}
            />
          </div>

          {/* Editable Quantity (max: 1000) */}
          <div className="w-[15%] ml-15">
            <input
              type="number"
              name="quantity"
              onChange={handleChange}
              value={formData.quantity}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              step="1"
              min="0"
              max="1000"
              onInput={(e) => {
                if (e.target.value > 1000) e.target.value = 1000;
              }}
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
