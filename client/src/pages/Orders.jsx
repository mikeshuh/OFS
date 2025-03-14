import React, { useState } from "react";
import DiscountBanner from "../components/DiscountBanner";
import Navbar from "../components/Navbar.jsx";

function Orders() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
};

const [viewMode, setView] = useState(true);
    const EditButton = () => {
            setView(!viewMode);
    };

const toOrderDetails = () => {
  window.location.href="./orderDetails";
}

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="flex-1 flex-col items-center justify-center text-center p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>
        <table className="mx-auto border-collapse border-[3px] border-solid border-green-500 font-size: 16px">
        <tr className="border-[#28a745]">
            <th className="w-[150px] text-white bg-green-500">Order ID</th>
            <th className="w-[150px] text-white bg-green-500">Total Cost</th>
            <th className="w-[150px] text-white bg-green-500">Date</th>
            <th className="w-[150px] text-white bg-green-500">Details</th>
        </tr>
        <tr className="border-[#28a745]">
            <td className="w-[150px] border border-solid border-green-500">1</td>
            <td className="w-[150px] border border-solid border-green-500">10.68</td>
            <td className="w-[150px] border border-solid border-green-500">2025-03-01 12:54:39</td>
            <td>
            <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300" onClick={toOrderDetails}>
                View
            </button>
            </td>
        </tr>
        </table>
        
      </div>
    </div>
  );
};

export default Orders;
