import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { requestServer } from "../utils/Utility";

const API_URL = import.meta.env.VITE_API_URL;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchDateStart, setSearchDateStart] = useState("");
  const [searchDateEnd, setSearchDateEnd] = useState("");
  const [searchDeliveryStatus, setSearchDeliveryStatus] = useState("All");
  const [error, setError] = useState(null);
  const [errorDate, setErrorDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState("");
  const navigate = useNavigate();

  const statusOptions = ["All", "Delivered", "In Progress"];

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await requestServer(`${API_URL}/api/orders/user`, "GET");
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
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        setError("Failed to fetch orders. Please try again later.");
        setErrorDetails(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const parseDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {

    const filterOrders = () => {
      const filtered = orders.filter(order => {
        const localDate = parseDate(new Date(order.orderTime))
        const matchDate = (!searchDateStart || localDate >= searchDateStart) && (!searchDateEnd || localDate <= searchDateEnd);
        const matchStatus =
          searchDeliveryStatus === "All" ||
          (searchDeliveryStatus === "Delivered" && order.orderStatus) ||
          (searchDeliveryStatus === "In Progress" && !order.orderStatus);

        return matchDate && matchStatus;
      });

      setFilteredOrders(filtered);
    };
    filterOrders();
  }, [orders, searchDateStart, searchDateEnd, searchDeliveryStatus]);

  const handleDateChange = (e) => {
    const {name,value} = e.target;
    setErrorDate(null);
    if (name === "endDate" && searchDateStart && value < searchDateStart ||
      name === "startDate" && searchDateEnd && value > searchDateEnd) {
      setErrorDate("End date cannot be earlier than start date.");
      return;
    }

    if (value > new Date().toISOString().split('T')[0]) {
      setErrorDate("Date cannot be in the future.");
      return;
    }
    name == "startDate" ? setSearchDateStart(value) : setSearchDateEnd(value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setSearchDeliveryStatus(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Your Order History
          </h1>

          {error && (
            <div className="w-full bg-red-100 text-red-700 p-4 rounded-lg mb-6 shadow-sm border border-red-200">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">{error}</p>
                  {errorDetails && (
                    <p className="mt-1 text-sm text-red-600">{errorDetails}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Order Status</label>
                <div className="relative">
                  <select
                    value={searchDeliveryStatus}
                    onChange={handleStatusChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm appearance-none bg-white"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>

                <div className ="flex flex-col ">

                  <div className="flex flex-row gap-4">
                    <label className= "block text-gray-700 mb-2 font-medium w-1/2">Start Date:</label>
                    <label className= "block text-gray-700 mb-2 font-medium w-1/2">End Date:</label>
                  </div>
                  <div className="flex flex-row gap-4">

                    <input
                      type="date"
                      name="startDate"
                      value={searchDateStart}
                      onChange={handleDateChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={searchDateEnd}
                      onChange={handleDateChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                    />
                  </div>
                  {errorDate && (
                    <div className="text-red-700 px-4 py-3 rounded mb-4 text-sm">
                      {errorDate}
                    </div>
                  )}
                </div>
                </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSearchDateStart("");
                  setSearchDateEnd("");
                  setSearchDeliveryStatus("All");
                  setFilteredOrders(orders);
                  setErrorDate(null);
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="w-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredOrders.length === 0 && !error ? (
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-2 text-gray-500">
                {searchDateStart || searchDeliveryStatus !== "All"
                  ? "No orders match your filter criteria. Try changing your filters."
                  : "You haven't made any orders yet."}
              </p>
            </div>
          ) : (
            filteredOrders.length > 0 && (
              <div className="overflow-hidden rounded-xl shadow-xl ring-1 ring-gray-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gradient-to-r from-green-600 to-green-500">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-1/6">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-1/6">
                          Total Price
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-1/6">
                          Total Pounds
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-1/6">
                          Order Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-1/6">
                          Order Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-1/6">
                          Payment Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map(order => (
                        <tr
                          key={order.orderID}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => navigate(`/order-confirmation/${order.orderID}`)}
                              className="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors duration-150"
                            >
                              <span className="text-gray-400 mr-1">#</span>
                              <span className="underline">{order.orderID}</span>
                              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900 font-medium">${Number(order.totalPrice).toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="font-medium">{order.totalPounds}</span>
                              <span className="ml-1 text-gray-500 text-sm">lbs</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {new Date(order.orderTime).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${order.orderStatus
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              }`}>
                              {order.orderStatus ? (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Delivered
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  In Progress
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                              }`}>
                              {order.paymentStatus === "paid" ? (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                  </svg>
                                  Paid
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                  </svg>
                                  Pending
                                </>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
