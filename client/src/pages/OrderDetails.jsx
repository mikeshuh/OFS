import React, { useState } from "react";
<<<<<<< HEAD
=======
import DiscountBanner from "../components/DiscountBanner";
>>>>>>> 99cad11dbc2c87e2fbe92bc54016ccd97d718cc6
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

<<<<<<< HEAD
=======
      {/* Discount */}
      <DiscountBanner />

>>>>>>> 99cad11dbc2c87e2fbe92bc54016ccd97d718cc6
      {/* Main page information */}
      <div className="flex-1 flex-col items-center justify-center text-center p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 ">Order Details: [ID#]</h1>

        <table className="mx-auto border-collapse shadow-md border-solid border-gray-500 text-left">
        <tr className="border-b-[1px]">
            <th className="w-[150px] h-[45px] p-[10px]">Total Cost</th>
            <th className="w-[150px] h-[45px] p-[10px]">Total Pounds</th>
            <th className="w-[150px] h-[45px] p-[10px]">Devlivery Fee</th>
            <th className="w-[150px] h-[45px] p-[10px]">Date</th>
        </tr>
        <tr>
            <td className="w-[150px] h-[85px] p-[10px]">10.68</td>
            <td className="w-[150px] h-[85px] p-[10px]">3.96</td>
            <td className="w-[150px] h-[85px] p-[10px]">No</td>
            <td className="w-[150px] h-[85px] p-[10px]">2025-03-01 12:54:39</td>
        </tr>
        </table>

        <br/>

        <table className="mx-auto border-collapse shadow-md border-solid border-gray-500 text-left">
        <tr className="border-b-[1px]">
            <th className="w-[150px] h-[45px] p-[10px]">Status</th>
            <th className="w-[150px] h-[45px] p-[10px]">Address</th>
            <th className="w-[150px] h-[45px] p-[10px]">City</th>
            <th className="w-[150px] h-[45px] p-[10px]">Zip Code</th>
        </tr>
        <tr>
            <td className="w-[150px] h-[85px] p-[10px]">Delivered</td>
            <td className="w-[150px] h-[85px] p-[10px]">2 East William Street</td>
            <td className="w-[150px] h-[85px] p-[10px]">San Jose</td>
            <td className="w-[150px] h-[85px] p-[10px]">95112</td>
        </tr>
        </table>

        <br/>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Cart Details</h1>
        <table className="mx-auto border-collapse shadow-md border-solid border-gray-500 text-left">
        <tr className="border-b-[1px]">
            <th className="w-[150px] h-[45px] p-[10px]">Product</th>
            <th className="w-[150px] h-[45px] p-[10px]">Amount</th>
            <th className="w-[150px] h-[45px] p-[10px]">Total Cost</th>
            <th className="w-[150px] h-[45px] p-[10px]">Total Pounds</th>
        </tr>
        <tr>
            <td className="w-[150px] h-[85px] p-[10px]">Apple</td>
            <td className="w-[150px] h-[85px] p-[10px]">12</td>
            <td className="w-[150px] h-[85px] p-[10px]">10.68</td>
            <td className="w-[150px] h-[85px] p-[10px]">3.96</td>
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
