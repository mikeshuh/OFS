import React, { useState } from "react";
import DiscountBanner from "../components/DiscountBanner";
import Navbar from "../components/Navbar.jsx";


function Products() {

  const toProductDetails = () => {
    window.location.href="./productDetails";
  };

  return (
    <div>
      <Navbar />

      <DiscountBanner />

      <div className="flex-1 flex-col items-center justify-center text-center p-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Products Page!</h2>
        <p className="text-lg text-gray-600">Here you will find all our available products.</p>
      
        <table className="mx-auto border-collapse border-[3px] border-solid border-green-500 font-size: 16px">
        <tr className="border-[#28a745]">
            <th className="w-[150px] text-white bg-green-500">Product Name</th>
            <th className="w-[150px] text-white bg-green-500">View</th>
        </tr>
        <tr className="border-[#28a745]">
            <td className="w-[150px] border border-solid border-green-500">Food</td>
            <td>
            <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300" onClick={toProductDetails}>
                View
            </button>
            </td>
        </tr>
        </table>
      
      </div>
    </div>
  );
};

export default Products;
