import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import OrderDetailsTableDiv from "../components/OrderDetailsTableDiv.jsx";
import { requestServer } from "../utils/Utility";

function OrderDetails(orderIDParameter = number) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
};

  const [viewMode, setView] = useState(true);
    const EditButton = () => {
            setView(!viewMode);
    };

  const navigate = useNavigate();

  const toOrder = () => {
    navigate("/orders");
  }


  /*ordersD should only have the specified orderID
    select * from `Order`
    WHERE orderID = 1;

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
  const ordersD = [
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
  ];

  /*orderProducts should only have the orderProducts with the specified orderID
    select * from OrderProduct
    WHERE orderID = 1;
  */

  const orderProducts = [
    {
      orderProductID: 1,
      orderID: 1,
      productID: 1,
      quantity: 12,
    },
    {
      orderProductID: 1,
      orderID: 1,
      productID: 1,
      quantity: 12,
    },
    {
      orderProductID: 1,
      orderID: 1,
      productID: 1,
      quantity: 12,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navi Bar */}
      <Navbar />

      <div>
      <OrderDetailsTableDiv
        ordersD={ordersD}
        orderIDValue={ordersD[0].orderID}
        orderProducts={orderProducts}
      />
      </div>
      
      <div className="flex-1 flex-col items-center justify-center text-center">
        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={toOrder}>
                Back
            </button>
      </div>
    </div>
  );
};

export default OrderDetails;
