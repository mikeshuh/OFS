import React from 'react';
import OrderTable from './OrderTable.jsx';

const OrderTableDiv = ({orders = []}) => {

    if (!orders || orders.length === 0) {
        return (
        <div className="flex-1 flex-col items-center justify-center p-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Order History</h1>

          <div className="py-8 text-center text-gray-500">
            No orders to display
          </div>
        </div>
        );
    }

  return (
    <div className="flex-1 flex-col items-center justify-center p-12 text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Order History</h1>
        
        {orders.map(order => (
          <OrderTable
            key={order.orderID}
            order={order}
          />
        ))}
        
    </div>
  );
};

export default OrderTableDiv;
