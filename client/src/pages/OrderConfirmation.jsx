import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../components/AuthContext";
import { requestServer } from "../utils/Utility";
import { useCart } from "../components/CartContext";

const API_URL = import.meta.env.VITE_API_URL;

const OrderConfirmation = () => {
  const { orderID } = useParams();
  const { token } = useAuth();
  const { getTaxRate } = useCart();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await requestServer(
          `${API_URL}/api/orders/details/${orderID}`,
          "GET",
          token
        );

        if (!response.data?.success) {
          setError(response.data?.message || "Failed to fetch order details");
          setLoading(false);
          return;
        }

        setOrderDetails(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };

    if (orderID && token) {
      fetchOrderDetails();
    }
  }, [orderID, token]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Group products by category for display
  const getProductsByCategory = () => {
    if (!orderDetails) return {};

    const productsByCategory = {};
    orderDetails.forEach(item => {
      if (!productsByCategory[item.category]) {
        productsByCategory[item.category] = [];
      }
      productsByCategory[item.category].push(item);
    });

    return productsByCategory;
  };

  // Calculate order totals
  const calculateTotals = () => {
    if (!orderDetails || orderDetails.length === 0) return { subtotal: 0, tax: 0, total: 0 };

    const subtotal = orderDetails.reduce((sum, item) => sum + (item.price * item.orderQuantity), 0);
    const shippingFee = orderDetails[0].deliveryFee ? 10 : 0;
    const tax = (subtotal + shippingFee) * getTaxRate();
    const total = subtotal + tax;

    return { subtotal, shippingFee, tax, total };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error || "Failed to load order details"}
          </div>
          <Link to="/" className="text-green-600 hover:text-green-800 font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const { subtotal, shippingFee, tax, total } = calculateTotals();
  const productsByCategory = getProductsByCategory();
  const firstItem = orderDetails[0]; // Get first item to access order-level details

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center border-b pb-6 mb-6">
            <div className="inline-flex items-center justify-center bg-green-100 rounded-full w-16 h-16 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your order. We've received your payment and will begin processing your items right away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Information</h2>
              <div className="space-y-3">
                <p>
                  <span className="font-medium text-gray-700">Order Number:</span> #{orderID}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Date:</span> {formatDate(firstItem.orderTime)}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Payment Status:</span>{" "}
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Paid
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Delivery Status:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      firstItem.orderStatus
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {firstItem.orderStatus ? 'Delivered' : 'In Progress'}
                  </span>
                </p>
              </div>
            </div>

            {/* Delivery Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Information</h2>
              <div className="space-y-3">
                <p>
                  <span className="font-medium text-gray-700">Address:</span> {firstItem.streetAddress}
                </p>
                <p>
                  <span className="font-medium text-gray-700">City:</span> {firstItem.city}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Zip Code:</span> {firstItem.zipCode}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Delivery Fee:</span>{" "}
                  {firstItem.deliveryFee ? "$10.00" : "Free"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>

            {Object.entries(productsByCategory).map(([category, products]) => (
              <div key={category} className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">{category}</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {products.map((item) => (
                    <div key={item.orderProductID} className="flex justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.orderQuantity} x ${parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.orderQuantity * parseFloat(item.price)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="w-full max-w-md ml-auto">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({(getTaxRate()*100).toFixed(3)}%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg">
                    ${(total + (firstItem.deliveryFee ? 10 : 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
