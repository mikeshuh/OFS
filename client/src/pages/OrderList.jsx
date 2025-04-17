import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { requestServer } from "../utils/Utility";

const API_URL = import.meta.env.VITE_API_URL;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("all");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const statusOptions = ["all", "completed", "pending"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await requestServer(`${API_URL}/api/orders/user`, "GET", token);
        const data = response?.data?.data || response?.data || [];

        if (Array.isArray(data)) {
          setOrders(data);
          setFilteredOrders(data);
          setError(null);
        } else {
          throw new Error("Invalid server response");
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to fetch orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);


  const filterOrders = (selectedDate, selectedStatus) => {
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt || order.orderTime);
      const localDate = new Date(orderDate.getTime() - orderDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
  
      const matchDate = !selectedDate || localDate === selectedDate;
      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "completed" && order.orderStatus) ||
        (selectedStatus === "pending" && !order.orderStatus);
  
      return matchDate && matchStatus;
    });
  
    setFilteredOrders(filtered);
  };
  
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setSearchDate(dateValue);
    filterOrders(dateValue, deliveryStatus);
  };
  
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setDeliveryStatus(value);
    filterOrders(searchDate, value);
  };
  
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Order History</h1>

        {error && (
          <div className="w-full max-w-2xl bg-red-100 text-red-700 p-4 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <div className="mb-6 w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="w-full sm:w-1/2">
            <label className="block text-gray-700 mb-2 font-medium">Order Status:</label>
            <select
              value={deliveryStatus}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-1/2">
            <label className="block text-gray-700 mb-2 font-medium">Filter by Order Date:</label>
            <input
              type="date"
              value={searchDate}
              onChange={handleDateChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
            />
          </div>
        </div>

        {filteredOrders.length === 0 && !error ? (
          <p className="text-gray-600">You haven't made any orders</p>
        ) : (
          filteredOrders.length > 0 && (
            <div className="w-full max-w-6xl overflow-x-auto rounded-2xl shadow-xl ring-1 ring-gray-200">
              <table className="min-w-full bg-white text-center rounded-2xl">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Total Price</th>
                    <th className="px-4 py-3">Total Pounds</th>
                    <th className="px-4 py-3">Order Time</th>
                    <th className="px-4 py-3">Order Status</th>
                    <th className="px-4 py-3">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.orderID} className="border-t hover:bg-gray-50 transition duration-150">
                      <td
                        className="px-4 py-2 text-green-600 hover:underline cursor-pointer font-medium"
                        onClick={() => navigate(`/order-confirmation/${order.orderID}`)}
                      >
                        #{order.orderID}
                      </td>
                      <td className="px-4 py-2">${Number(order.totalPrice).toFixed(2)}</td>
                      <td className="px-4 py-2">{order.totalPounds} lbs</td>
                      <td className="px-4 py-2">{new Date(order.createdAt || order.orderTime).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          order.orderStatus ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.orderStatus ? "Completed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-2 capitalize">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default OrderList;
