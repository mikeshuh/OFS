import React, { useState } from "react";
import DiscountBanner from "../components/DiscountBanner";
import Navbar from "../components/Navbar.jsx";


function ProductDetails() {

const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };
    
    const toProducts = () => {
        window.location.href="./products";
    };

    const addToCart = () => {
        window.alert("Perfrom add to cart function.");
    };

  return (
    <div>
      <Navbar />

      <DiscountBanner />

      <div className="flex-1 flex-col items-center justify-center text-center p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Details</h1>
       
        <table className="mx-auto border-collapse border-[3px] border-solid border-green-500 font-size: 16px">
        <tr className="border-[#28a745]">
            <th className="w-[150px] text-white bg-green-500">Cost</th>
            <th className="w-[150px] text-white bg-green-500">Pounds</th>
            <th className="w-[150px] text-white bg-green-500">In Stock</th>
        </tr>
        <tr className="border-[#28a745]">
            <td className="w-[150px] border border-solid border-green-500">$4.99</td>
            <td className="w-[150px] border border-solid border-green-500">10</td>
            <td className="w-[150px] border border-solid border-green-500">100</td>
        </tr>
        </table>
      
      <br/>
      <p>Enter amount: </p>
        <input
              type="number"
              placeholder="Num"
              min="0"
              max="999"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-[10px] border w-[70px]
              px-3 py-2 border-solid border-[#ddd]"/>

        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300" onClick={addToCart}>
                Add to Cart
            </button>

        <br/>

        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300" onClick={toProducts}>
                Back
        </button>

      </div>
    </div>
  );
};

export default ProductDetails;
