import React from 'react';
import { useAuth } from './AuthContext';

const OrderDetailsTable = ({ order }) => {
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

  return (
    <div>
    <table className="mx-auto border-collapse shadow-md border-solid border-gray-500 text-left">
        <tr className="border-b-[1px]">
            <th className="w-[150px] h-[45px] p-[10px]">Total Cost</th>
            <th className="w-[150px] h-[45px] p-[10px]">Total Pounds</th>
            <th className="w-[150px] h-[45px] p-[10px]">Devlivery Fee</th>
            <th className="w-[150px] h-[45px] p-[10px]">Date</th>
        </tr>
        <tr>
            <td className="w-[150px] h-[85px] p-[10px]">{totalPrice}</td>
            <td className="w-[150px] h-[85px] p-[10px]">{totalPounds}</td>
            <td className="w-[150px] h-[85px] p-[10px]">{deliveryFee}</td>
            <td className="w-[150px] h-[85px] p-[10px]">{orderTime}</td>
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
            <td className="w-[150px] h-[85px] p-[10px]">{paymentStatus}</td>
            <td className="w-[150px] h-[85px] p-[10px]">{streetAddress}</td>
            <td className="w-[150px] h-[85px] p-[10px]">{city}</td>
            <td className="w-[150px] h-[85px] p-[10px]">{zipCode}</td>
        </tr>
        </table>
    </div>
  );
};

export default OrderDetailsTable;
