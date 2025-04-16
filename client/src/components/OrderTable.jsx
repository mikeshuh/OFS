import React from 'react';
import { useAuth } from './AuthContext';
import { useParams, useNavigate } from "react-router-dom";

const OrderTable = ({ order }) => {
  const { loggedIn } = useAuth();

  if (!order) {
    return null;
  }

  // Destructure product properties
  const {
    orderID,
    userID,
    totalPrice,
    totalPounds,
    deliveryFee,
    orderTime,
    orderStatus,
    paymentStatus,
    streetAddress,
    city,
    zipCode,
  } = order;

  const navigate = useNavigate();

  const handleButton = () => {
   /*window.location.href="./profile";*/
   navigate("/orderDetails", orderID);
  }

  /*
  Button should redirect user to the orderDetails while passing the orderID info.
  OrderDetails should display a list of purchased products from that orderID
  */

  return (
    <div>
    <table className="mx-auto border-collapse shadow-md border-solid border-gray-500 text-left">
        <tr className="border-b-[1px]">
            <th className="w-[150px] h-[45px] p-[10px]">Order ID</th>
            <th className="w-[150px] h-[45px] p-[10px]">Total Cost</th>
            <th className="w-[150px] h-[45px] p-[10px]">Date</th>
            <th className="w-[150px] h-[45px] text-center"></th>
        </tr>
        <tr>
            <td className="w-[150px] h-[85px] p-[10px]">{orderID}</td>
            <td className="w-[150px] h-[85px] p-[10px]">{totalPrice}</td>
            <td className="w-[150px] h-[85px] p-[10px]">{orderTime}</td>
            <td className="w-[150px] h-[85px] text-center">
            <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={handleButton}>
                Details
            </button>
            </td>
        </tr>
    </table>
      <br/>
    </div>
  );
};

export default OrderTable;
