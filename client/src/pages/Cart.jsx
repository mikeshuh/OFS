import React, { useState, useEffect } from "react";
import DiscountBanner from "../components/DiscountBanner";
import Navbar from "../components/Navbar.jsx";

function ShoppingCart() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };

  const [viewMode, setView] = useState(true);
    const EditButton = () => {
            setView(!viewMode);
    };

  const toCheckout = () => {
    window.location.href="./checkout";
  };

  const discardCart = () => {
    alert("This function should cancel shopping");
  };

  return (
    <div classname="flex flex-col min-h-screen">
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="flex-1 flex-col items-center justify-center text-center p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
        
        <table className="mx-auto border-collapse border-[3px] border-solid border-gray-500 font-size: 16px">
        <tr className="border-[#28a745]">
            <th className="w-[150px] text-white bg-gray-500">Item</th>
            <th className="w-[150px] text-white bg-gray-500">Individual Cost</th>
            <th className="w-[150px] text-white bg-gray-500">Individual Pounds</th>
            <th className="w-[150px] text-white bg-gray-500">Quantity</th>
        </tr>
        <tr className="border-[#28a745]">
            <td className="w-[150px] border border-solid border-gray-500">Apple</td>
            <td className="w-[150px] border border-solid border-gray-500">0.89</td>
            <td className="w-[150px] border border-solid border-gray-500">0.33</td>
            <td className="w-[150px] border border-solid border-gray-500">12
            {!viewMode && <input
              type="number"
              placeholder="Num"
              min="0"
              max="999"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-[10px] border w-[70px]
              px-3 py-2 border-solid border-[#ddd]"/>}
            </td>
        </tr>
        </table>
        
        {viewMode && <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={toCheckout} >
          Purchase
        </button>}
        
        {viewMode && <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={EditButton}>
          Edit Cart
        </button>}

        {viewMode && <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={discardCart}>
          Discard Cart
        </button>}

        {!viewMode && <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={EditButton}>
          Save Changes
        </button>}

        {!viewMode && <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={EditButton}>
          Cancel Changes
        </button>}

      </div>
    </div>
  );
};

export default ShoppingCart;
