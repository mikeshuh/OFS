import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { requestServer } from "../utils/Utility";

const API_URL = import.meta.env.VITE_API_URL;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await requestServer(`${API_URL}/api/orders/user`, "GET", token);
        const data = response?.data?.data || response?.data || [];
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Order History</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">You haven't make any order</p>
        ) : (
          <div className="w-full max-w-6xl overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Total Price</th>
                  <th className="px-4 py-3 text-left">Total Pounds</th>
                  <th className="px-4 py-3 text-left">Order Time</th>
                  <th className="px-4 py-3 text-left">Order Status</th>
                  <th className="px-4 py-3 text-left">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.orderID} className="border-t hover:bg-gray-50">
                    <td
                      className="px-4 py-2 text-green-600 hover:underline cursor-pointer"
                      onClick={() => navigate(`/order-confirmation/${order.orderID}`)}
                    >
                      {order.orderID}
                    </td>
                    <td className="px-4 py-2">${Number(order.totalPrice).toFixed(2)}</td>
                    <td className="px-4 py-2">{order.totalPounds} lbs</td>
                    <td className="px-4 py-2">{new Date(order.createdAt || order.orderTime).toLocaleString()}</td>
                    <td className="px-4 py-2">{order.orderStatus ? "Complete" : "Pending"}</td>
                    <td className="px-4 py-2 capitalize">{order.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
