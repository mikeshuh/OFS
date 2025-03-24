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

const toProfile = () => {
  window.location.href="./profile";
}

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="flex-1 flex-col items-center justify-center p-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>
        <table className="rounded-[5px] mx-auto border-collapse border-[3px] border-solid border-gray-500 font-size: 16px text-left">
        <tr className="border-[#28a745]">
            <th className="w-[150px] h-[45px] text-white bg-gray-500 text-center">Order ID</th>
            <th className="w-[150px] h-[45px] text-white bg-gray-500">Total Cost</th>
            <th className="w-[150px] h-[45px] text-white bg-gray-500">Date</th>
            <th className="w-[150px] h-[45px] text-white bg-gray-500 text-center">Details</th>
        </tr>
        <tr className="border-[#28a745]">
            <td className="w-[150px] h-[85px] text-center">1</td>
            <td className="w-[150px] h-[85px]">10.68</td>
            <td className="w-[150px] h-[85px]">2025-03-01 12:54:39</td>
            <td className="w-[150px] h-[85px] text-center">
            <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={toOrderDetails}>
                View
            </button>
            </td>
        </tr>
        </table>
        
        <br/>
        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={toProfile}>
                Back to Profile
            </button>

      </div>
    </div>
  );
};

export default Orders;
