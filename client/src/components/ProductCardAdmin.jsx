import React, { useState, useEffect } from "react";
import { requestServer } from "../utils/Utility";

const API_URL = import.meta.env.VITE_API_URL;

const MAX_PRICE = 9999.99;
const MAX_POUNDS = 999.99;
const MAX_QUANTITY = 1000;

const REGEX_PRICE_POUNDS = /^\d+(\.\d{1,2})?$/;
const REGEX_QUANTITY = /^\d+$/;

const ProductCardAdmin = React.memo(({ product, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    price: product.price,
    pounds: product.pounds,
    quantity: product.quantity
  });
  const [message, setMessage] = useState("");

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Sync local formData with incoming product prop changes
  useEffect(() => {
    setFormData({
      price: product.price,
      pounds: product.pounds,
      quantity: product.quantity
    });
  }, [product]);

  const handleClick = () => {
    setEditMode(!editMode);
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For price and pounds: allow only numbers with up to 2 decimals
    if (name === 'price' || name === 'pounds') {
      if (REGEX_PRICE_POUNDS.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
    // For quantity: only allow whole numbers
    else if (name === 'quantity') {
      if (REGEX_QUANTITY.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
    // Default case if needed
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const { price, pounds, quantity } = formData;
    if (
      price <= 0 || price > MAX_PRICE ||
      pounds <= 0 || pounds > MAX_POUNDS ||
      quantity < 0 || quantity > MAX_QUANTITY
    ) {
      setMessage("⚠ Invalid input values");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await requestServer(
        `${API_URL}/api/products/update-product/${product.productID}`,
        "PUT",
        token,
        {
          name: product.name,
          category: product.category,
          price,
          pounds,
          quantity,
          imagePath: product.imagePath
        }
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Update failed");
      }

      // Update parent state with updated product data
      onUpdate?.({
        ...product,
        price: parseFloat(price).toFixed(2),
        pounds: parseFloat(pounds).toFixed(2),
        quantity: parseInt(quantity)
      });
      setMessage("✔ Product updated");
    } catch (error) {
      setMessage("⚠ Failed to update product");
      console.error("Error:", error);
    } finally {
      setEditMode(false);
    }
  };

  return (
    <div className="flex items-center w-full border-b px-5 py-2 text-sm relative">

      {/* Name */}
      <div className="w-[15%]">{product.name}</div>

      {/* Category */}
      <div className="w-[15%]">{product.category}</div>

      {editMode ? (
        <>
          <div className="w-[15%] pr-2">
            <input
              aria-label="Price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              step="0.01"
              min="0.01"
              max={MAX_PRICE}
              required
            />
            <p className="text-[10px] text-gray-500 mt-1">Max: ${MAX_PRICE}</p>
          </div>
          <div className="w-[15%] pr-2">
            <input
              aria-label="Pounds"
              type="number"
              name="pounds"
              value={formData.pounds}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              step="0.01"
              min="0.01"
              max={MAX_POUNDS}
              required
            />
            <p className="text-[10px] text-gray-500 mt-1">Max: {MAX_POUNDS} lbs</p>
          </div>
          <div className="w-[15%] pr-2">
            <input
              aria-label="Quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              step="1"
              min="0"
              max={MAX_QUANTITY}
              required
            />
            <p className="text-[10px] text-gray-500 mt-1">Max: {MAX_QUANTITY}</p>
          </div>
          <div className="w-[15%] pr-2">
            {product.imagePath ? (
              <img
                src={`${API_URL}/static/${product.imagePath}`}
                alt={product.name}
                className="w-16 h-12 object-cover rounded"
              />
            ) : (
              <span className="text-xs text-gray-400">No image</span>
            )}
          </div>
          <div className="w-[15%] flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="text-green-700 underline hover:text-green-900"
              aria-label="Cancel Edit"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-green-700 underline hover:text-green-900"
              aria-label="Save Changes"
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-[15%]">{product.price}</div>
          <div className="w-[15%]">{product.pounds}</div>
          <div className="w-[15%]">{product.quantity}</div>
          <div className="w-[15%]">
            {product.imagePath ? (
              <img
                src={`${API_URL}/static/${product.imagePath}`}
                alt={product.name}
                className="w-16 h-12 object-cover rounded"
              />
            ) : (
              <span className="text-xs text-gray-400">No image</span>
            )}
          </div>
          <div className="w-[15%] text-green-700">
            <button
              onClick={handleClick}
              className="underline hover:text-green-900 transition-all"
              aria-label="Edit Product"
            >
              Edit
            </button>
          </div>
        </>
      )}

      {/* Status */}
      <div className={`w-[15%] text-xs ${message.startsWith("✔") ? "text-green-600" : "text-red-600"}`}>
        {message}
      </div>

    </div>
  );
});

export default ProductCardAdmin;
