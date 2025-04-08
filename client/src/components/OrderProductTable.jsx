import React from 'react';
import { useAuth } from './AuthContext';

const OrderProductTable = ({ orderProduct }) => {
  const { loggedIn } = useAuth();

  if (!orderProduct) {
    return null;
  }

  // Destructure product properties
  const {
    orderProductID,
    orderID,
    productID,
    quantity,
  } = orderProduct;

  /*
  Button should take orderID as a parameter?
  OrderDetails should display a list of purchased products from that orderID
  */

  const calculateCost = () => {
  };

  const calculatePounds = () => {
  };

  return (
    <tr>
        <td className="w-[150px] h-[45px] p-[10px]">{productID}</td>
        <td className="w-[150px] h-[45px] p-[10px]">{quantity}</td>
        <td className="w-[150px] h-[45px] p-[10px]">Todo</td>
        <td className="w-[150px] h-[45px] p-[10px]">Todo</td>
    </tr>
  );
};

export default OrderProductTable;
