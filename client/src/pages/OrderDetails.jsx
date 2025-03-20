import React, { useState } from "react";
import DiscountBanner from "../components/DiscountBanner";
import Navbar from "../components/Navbar.jsx";

function OrderDetails() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
};

const [viewMode, setView] = useState(true);
    const EditButton = () => {
            setView(!viewMode);
    };

const toOrder = () => {
  window.location.href="./orders";
}

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="flex-1 flex-col items-center justify-center text-center p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>

        <table className="mx-auto border-collapse border-[3px] border-solid border-gray-500 font-size: 16px">
        <tr className="border-[#28a745]">
            <th className="w-[150px] text-white bg-gray-500">Order ID</th>
            <th className="w-[150px] text-white bg-gray-500">Total Cost</th>
            <th className="w-[150px] text-white bg-gray-500">Total Pounds</th>
            <th className="w-[150px] text-white bg-gray-500">Devlivery Fee?</th>
            <th className="w-[150px] text-white bg-gray-500">Date</th>
            <th className="w-[150px] text-white bg-gray-500">Status</th>
            <th className="w-[150px] text-white bg-gray-500">Address</th>
            <th className="w-[150px] text-white bg-gray-500">City</th>
            <th className="w-[150px] text-white bg-gray-500">Zip Code</th>
        </tr>
        <tr className="border-[#28a745]">
            <td className="w-[150px] border border-solid border-gray-500">1</td>
            <td className="w-[150px] border border-solid border-gray-500">10.68</td>
            <td className="w-[150px] border border-solid border-gray-500">3.96</td>
            <td className="w-[150px] border border-solid border-gray-500">Yes</td>
            <td className="w-[150px] border border-solid border-gray-500">2025-03-01 12:54:39</td>
            <td className="w-[150px] border border-solid border-gray-500">Delivered</td>
            <td className="w-[150px] border border-solid border-gray-500">2 East William Street</td>
            <td className="w-[150px] border border-solid border-gray-500">San Jose</td>
            <td className="w-[150px] border border-solid border-gray-500">95112</td>
        </tr>
        </table>

        <br/>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Cart Details</h1>
        <table className="mx-auto border-collapse border-[3px] border-solid border-gray-500 font-size: 16px">
        <tr className="border-[#28a745]">
            <th className="w-[150px] text-white bg-gray-500">Product</th>
            <th className="w-[150px] text-white bg-gray-500">Amount</th>
            <th className="w-[150px] text-white bg-gray-500">Total Cost</th>
            <th className="w-[150px] text-white bg-gray-500">Total Pounds</th>
        </tr>
        <tr className="border-[#28a745]">
            <td className="w-[150px] border border-solid border-gray-500">Apple</td>
            <td className="w-[150px] border border-solid border-gray-500">12</td>
            <td className="w-[150px] border border-solid border-gray-500">10.68</td>
            <td className="w-[150px] border border-solid border-gray-500">3.96</td>
        </tr>
        </table>
        
        <br/>

        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={toOrder}>
                Back
            </button>
      </div>
    </div>
  );
};

export default OrderDetails;
