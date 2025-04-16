import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import OrderTableDiv from "../components/OrderTableDiv.jsx";
import { requestServer } from "../utils/Utility";

/*
import UserModel from "...../server/src/models/userModel.js"
*/

function Orders() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };

  const [viewMode, setView] = useState(true);
    const EditButton = () => {
            setView(!viewMode);
    };

  const navigate = useNavigate();

  const toProfile = () => {
   /*window.location.href="./profile";*/
   navigate("/profile");
  }
  
  const uID = 2;

  /*
  Show orders with the specified userID
  select * from `Order`
  WHERE userID = UserIDValue;
  */

  const [ordersData, setProfileData] = useState(JSON.parse(localStorage.getItem("userProfile")));
  console.log("Orders Data: ", ordersData);

  const orders = [
    /*
    Replace current data with results from mysql select
      select * from `Order`
      WHERE userID = UserIDValue;

    SELECT 
      JSON_ARRAYAGG(
      JSON_OBJECT(
      'orderID', orderID,
	    'userID', userID,
	    'totalPrice', totalPrice,
	    'totalPounds', totalPounds,
	    'deliveryFee', deliveryFee,
	    'orderTime', orderTime,
	    'orderStatus', orderStatus,
	    'paymentStatus', paymentStatus,
	    'streetAddress', streetAddress,
	    'city', city,
	    'zipCode', zipCode
      )
    )
    FROM `Order`;
    */
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
      
      <div className="flex-1 flex-col items-center justify-center text-center">
        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={toProfile}>
          Back to Profile
        </button>
        </div>
        
    </div>
  );
};

export default Orders;
