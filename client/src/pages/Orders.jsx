import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import OrderTableDiv from "../components/OrderTableDiv.jsx";

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

  const orders = [
    {
      orderID: 1,
      userID: 11,
      totalPrice: "10.68",
      totalPounds: 3.96,
      deliveryFee: "No",
      orderTime: "2025-03-01 12:54:39",
      orderStatus: "True",
      paymentStatus: "paid",
      streetAddress: "2 East William Street",
      city: "San Jose",
      zipCode: "95112",
    },
    {
      orderID: 2,
      userID: 12,
      totalPrice: "10.68",
      totalPounds: 3.96,
      deliveryFee: "No",
      orderTime: "2025-03-01 14:41:23",
      orderStatus: "True",
      paymentStatus: "paid",
      streetAddress: "2 East William Street",
      city: "San Jose",
      zipCode: "95112",
    },
    {
      orderID: 3,
      userID: 13,
      totalPrice: "10.68",
      totalPounds: 3.96,
      deliveryFee: "No",
      orderTime: "2025-03-02 11:15:38",
      orderStatus: "True",
      paymentStatus: "paid",
      streetAddress: "2 East William Street",
      city: "San Jose",
      zipCode: "95112",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navi Bar */}
      <Navbar />
      
      <div>
      <OrderTableDiv
        orders={orders}
      />
      </div>

      {/* Main page information */}
      {/*
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
      */}
      
      <div className="flex-1 flex-col items-center justify-center text-center">
        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={toProfile}>
          Back to Profile
        </button>
        </div>
        
    </div>
  );
};

export default Orders;
