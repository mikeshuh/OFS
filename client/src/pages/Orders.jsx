import React, { useState } from "react";
<<<<<<< HEAD
=======
import DiscountBanner from "../components/DiscountBanner";
>>>>>>> 99cad11dbc2c87e2fbe92bc54016ccd97d718cc6
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

<<<<<<< HEAD
=======
      {/* Discount */}
      <DiscountBanner />

>>>>>>> 99cad11dbc2c87e2fbe92bc54016ccd97d718cc6
      {/* Main page information */}
      <div className="flex-1 flex-col items-center justify-center p-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Order History</h1>
        
        <table className="mx-auto border-collapse shadow-md border-solid border-gray-500 text-left">
        <tr className="border-b-[1px]">
            <th className="w-[150px] h-[45px] p-[10px]">Order ID</th>
            <th className="w-[150px] h-[45px] p-[10px]">Total Cost</th>
            <th className="w-[150px] h-[45px] p-[10px]">Date</th>
            <th className="w-[150px] h-[45px] text-center"></th>
        </tr>
        <tr>
            <td className="w-[150px] h-[85px] p-[10px]">1</td>
            <td className="w-[150px] h-[85px] p-[10px]">10.68</td>
            <td className="w-[150px] h-[85px] p-[10px]">2025-03-01 12:54:39</td>
            <td className="w-[150px] h-[85px] text-center">
            <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={toOrderDetails}>
                Details
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
