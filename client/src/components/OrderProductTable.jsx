import React from 'react';
import { useAuth } from './AuthContext';

const OrderProductTable = ({ orderProduct }) => {
  const { loggedIn } = useAuth();

  if (!orderProduct) {
    return null;
  }

  /*
  Should be something like this?
  
  SELECT Product.name, OrderProduct.quantity, Product.price, Product.pounds
  FROM OrderProduct
  INNER JOIN Product ON OrderProduct.productID=Product.productID
  INNER JOIN `Order` ON OrderProduct.orderID=Order.orderID;
  
  
  SELECT 
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'name', Product.name,
      'quantity', OrderProduct.quantity,
      'price', Product.price,
      'pounds', Product.pounds
    )
  )
  FROM OrderProduct
  INNER JOIN Product ON OrderProduct.productID=Product.productID
  INNER JOIN `Order` ON OrderProduct.orderID=Order.orderID;
  
  
  */
  // Destructure product properties
  const {
    orderProductID,
    orderID,
    productID,
    quantity,
  } = orderProduct;

  /*
    const {
    name,
    quantity,
    price,
    pounds,
  } = orderProduct;
  */

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
        <td className="w-[150px] h-[45px] p-[10px]">{quantity * quantity}</td>
        <td className="w-[150px] h-[45px] p-[10px]">{quantity * quantity}</td>
    </tr>
  );
};

export default OrderProductTable;
