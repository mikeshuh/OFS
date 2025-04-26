import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Navbar from "../components/Navbar";
import { useCart } from "../components/CartContext";
import { requestServer } from "../utils/Utility";

const API_URL = import.meta.env.VITE_API_URL;
const LS_ORDER_ID = "orderID";
const LS_CLIENT_SECRET = "clientSecret";
const LS_DELIVERY_ADDRESS = "deliveryAddress";
const WEIGHT_LIMIT = 50;

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, fetchProducts, calculateTotal, calculateTotalWithShipping, getTaxRate, calculateTotalWeight, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const isOverWeightLimit = calculateTotalWeight() > WEIGHT_LIMIT;
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isOrderCreated, setIsOrderCreated] = useState(false);
  const justPaidRef = useRef(false);

  const deliveryAddress = useMemo(() => {
    return JSON.parse(localStorage.getItem(LS_DELIVERY_ADDRESS) || "{}");
  }, [localStorage]);

  const subtotal = useMemo(() => calculateTotal(), [cartItems]);
  const shipping = useMemo(() => calculateTotalWithShipping() - subtotal, [cartItems]);
  const tax = useMemo(() => calculateTotalWithShipping() * getTaxRate(), [cartItems]);
  const total = useMemo(() => calculateTotalWithShipping() + tax, [cartItems]);

  const formattedTotals = useMemo(() => ({
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2)
  }), [subtotal, shipping, tax, total]);

  const clearCheckoutSession = () => {
    localStorage.removeItem(LS_ORDER_ID);
    localStorage.removeItem(LS_CLIENT_SECRET);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    if (cartItems.length === 0 && !justPaidRef.current) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    const orderID = localStorage.getItem(LS_ORDER_ID);
    if (orderID) {
      setIsOrderCreated(true);
      // Check if order is paid already, if so, clear checkout session
      // delay to ensure db is updated
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      const checkOrderPaymentStatus = async () => {
        await delay(3000);
        try {
          const orderDetails = await requestServer(
            `${API_URL}/api/orders/details/${orderID}`,
            "GET"
          );
          const orderPaymentStatus = orderDetails.data.data[0].paymentStatus;
          if (orderPaymentStatus === "paid" || orderPaymentStatus === "refunded") {
            clearCart();
            clearCheckoutSession();
            navigate(`/order-confirmation/${orderID}`);
          }
        } catch (error) {
          console.error("error checking order payment status:", error);
          setErrorMessage("Failed to check order payment status. Please try again.");
        }
      };

      checkOrderPaymentStatus();

    }

  }, [cartItems, deliveryAddress, isOrderCreated]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);
    const createOrder = async () => {
      try {
        const response = await requestServer(
          `${API_URL}/api/orders/create-order`,
          "POST",
          {
            streetAddress: deliveryAddress.streetAddress,
            zipCode: deliveryAddress.zipCode,
            city: deliveryAddress.city,
            orderProducts: cartItems.map(item => ({
              productID: item.productID,
              cartQuantity: item.cartQuantity
            })),
          }
        );
        if (!response.data?.success) {
          console.log(response.data?.message)
          throw new Error(response.data.message || "Failed to create order");
        }
        return response.data.data;
      } catch (error) {
        throw error;
      }
    };

    try {
      const cardElement = elements.getElement(CardElement);
      const { orderID, clientSecret } = await createOrder();
      localStorage.setItem(LS_ORDER_ID, orderID);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (error) {
        setErrorMessage(`Payment failed with code: ${error.code}`);
      } else if (paymentIntent.status === "succeeded") {
        justPaidRef.current = true;
        clearCart();
        clearCheckoutSession();
        navigate(`/order-confirmation/${orderID}`);
      } else {
        setErrorMessage("Payment processing failed. Please try again.");
      }
    } catch (error) {
      console.error("Error: ", error);
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="mb-6">
                {cartItems.map((item) => (
                  <div key={item.productID} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.cartQuantity} x ${parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.cartQuantity * parseFloat(item.price)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700">Delivery Address</h3>
                  <button
                    onClick={() => navigate("/checkout-map")}
                    className="text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>
                <p>{deliveryAddress.streetAddress}</p>
                <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${formattedTotals.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${formattedTotals.shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({(getTaxRate() * 100).toFixed(3)}%)</span>
                  <span className="font-medium">${formattedTotals.tax}</span>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${formattedTotals.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Card Information
                  </label>
                  <div className="border rounded-md p-4">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": { color: "#aab7c4" },
                          },
                          invalid: { color: "#9e2146" },
                        },
                      }}
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Test card: 4242 4242 4242 4242, any future date, any 3 digits for CVC, any 5 digits for postal code
                  </p>
                  {/* Message if cart weight exceeds 50 lbs */}
                  {isOverWeightLimit ? (
                    <p className="mt-2 text-red-500 text-sm">
                      Your cart weight exceeds the maximum allowed weight of {WEIGHT_LIMIT} lbs.
                    </p>
                  ) : errorMessage ? (
                    <p className="mt-2 text-red-500 text-sm">
                      {errorMessage}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !stripe || isOverWeightLimit}
                  className={`w-full py-3 rounded font-medium ${isProcessing || !stripe || isOverWeightLimit
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                    } text-white`}
                >
                  {isProcessing ? "Processing..." : `Pay $${formattedTotals.total}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
