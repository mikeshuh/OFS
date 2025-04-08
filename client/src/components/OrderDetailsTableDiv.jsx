import React from 'react';
import OrderProductTable from './OrderProductTable.jsx';
import OrderDetailsTable from './OrderDetailsTable.jsx';

const OrderDetailsDiv = ({ordersD, orderProducts = []}) => {

    if (!orderProducts || orderProducts.length === 0) {
        return (
        <div className="flex-1 flex-col items-center justify-center p-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>

          <div className="py-8 text-center text-gray-500">
            No orders to display
          </div>
        </div>
        );
    }

  return (
    <div className="flex-1 flex-col items-center justify-center p-12 text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>
        
        
    {ordersD.map(order => (
          <OrderDetailsTable
            key={order.orderID}
            order={order}
          />
    ))}

    <br/>

    <h1 className="text-3xl font-bold text-gray-800 mb-6">Cart Details</h1>
        <table className="mx-auto border-collapse shadow-md border-solid border-gray-500 text-left">
        <tr className="border-b-[1px]">
            <th className="w-[150px] h-[45px] p-[10px]">Product ID</th>
            <th className="w-[150px] h-[45px] p-[10px]">Amount</th>
            <th className="w-[150px] h-[45px] p-[10px]">Total Cost</th>
            <th className="w-[150px] h-[45px] p-[10px]">Total Pounds</th>
        </tr>
        {orderProducts.map(orderProduct => (
          <OrderProductTable
            key={orderProduct.orderProductID}
            orderProduct={orderProduct}
          />
        ))}
        </table>
    </div>
  );
};

export default OrderDetailsDiv;
