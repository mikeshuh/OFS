import React, { useState } from "react";
import { requestServer } from "../utils/Utility";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const ProductCardAdmin = ({ product }) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const handleClick = () => {
    setEditMode(!editMode);
  }
  const [formData, setFormData] = useState({
    price: product.price,
    pounds: product.pounds,
    quantity: product.quantity
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Form data: ", formData);
    try {
      const token = localStorage.getItem("authToken");
      const response = await requestServer(`${API_URL}/api/products/update-product/${product.productID}`, "PUT",token,
        {
          name: product.name,
          category: product.category,
          price: formData.price || product.price,
          pounds: formData.pounds || product.pounds,
          quantity: formData.quantity || product.quantity,
          imageBinary: product.imageBinary
        });
      console.log("Response: ", response);
      if (response.success) {
        navigate("/admin");
      }else{
        console.log(response.data?.message || response.message);
      }
    }catch (error) {
      console.log("Error: ", error);
    }finally{
      setEditMode(false);
    }
  };
  return (
    <div className="border-solid border-[rgba(18,2,19,0.10)] border-b flex flex-row gap-10 items-center justify-start self-stretch shrink-0 relative">
      <div className="border-solid border-[transparent] border-r border-b pl-5 flex flex-col gap-[5px] items-start justify-center self-stretch shrink-0 w-[129px] relative">
        <div className="text-[#120213] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative flex items-center justify-start overflow-hidden" style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {product.name}
        </div>
      </div>
      <div className="border-solid border-[transparent] border-r border-b flex flex-col gap-[5px] items-start justify-center self-stretch shrink-0 relative">
        <div className="text-[#120213] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative w-[110px] h-9 flex items-center justify-start overflow-hidden" style={{ textOverflow: "ellipsis" }}>
          {product.category}
        </div>
      </div>

      {!editMode ? (
        <div className="border-solid border-[rgba(18,2,19,0.10)] border-b flex flex-row gap-10 items-center justify-start self-stretch shrink-0 relative">
          <div className="border-solid border-[transparent] border-r border-b flex flex-col gap-[5px] items-start justify-center self-stretch shrink-0 relative">
            <div className="text-[#120213] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative w-[110px] h-9 flex items-center justify-start overflow-hidden" style={{ textOverflow: "ellipsis" }}>
              {product.price}
            </div>
          </div>
          <div className="border-solid border-[transparent] border-r border-b flex flex-col gap-[5px] items-start justify-center self-stretch shrink-0 relative">
            <div className="text-[#120213] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative w-[110px] h-9 flex items-center justify-start overflow-hidden" style={{ textOverflow: "ellipsis" }}>
              {product.pounds}
            </div>
          </div>
          <div className="border-solid border-[transparent] border-r border-b flex flex-col gap-[5px] items-start justify-center self-stretch shrink-0 relative">
            <div className="text-[#120213] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative w-[110px] h-9 flex items-center justify-start overflow-hidden" style={{ textOverflow: "ellipsis" }}>
              {product.quantity}
            </div>
          </div>
          <button onClick={handleClick} className="text-[#329141] underline text-sm hover:text-[#276c30] transition-all">
            Edit
          </button>
        </div>
      ) : (

        <div className="border-solid border-[rgba(18,2,19,0.10)] border-b flex flex-row gap-10 items-center justify-start self-stretch shrink-0 relative">
          <form onSubmit={handleSave} className="flex flex-row gap-10 items-center justify-start self-stretch shrink-0 relative">
            <input type="text" name="price" onChange={handleChange} className=" border border-gray-300 rounded w-25" placeholder="price" />
            <input type="text" name="pounds" onChange={handleChange} className=" border border-gray-300 rounded w-25" placeholder="pounds" />
            <input type="text" name="quantity" onChange={handleChange} className=" border border-gray-300 rounded w-25" placeholder="quantity" />
            <button onClick={handleClick} className="text-[#329141] underline text-sm hover:text-[#276c30] transition-all">
              Cancel
            </button>
            <button type="submit" className="text-[#329141] underline text-sm hover:text-[#276c30] transition-all">
              Save
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default ProductCardAdmin;
