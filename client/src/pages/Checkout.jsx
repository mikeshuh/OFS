import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Navbar from "../components/Navbar";
import { useCart } from "../components/CartContext";
import { useAuth } from "../components/AuthContext";
import { requestServer } from "../utils/Utility";

const API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, calculateTotal, clearCart } = useCart();
  const { token } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  // State variables
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [orderID, setOrderID] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);

  // Calculate amounts
  const subtotal = calculateTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Get delivery address from localStorage (set during the map page)
  const deliveryAddress = JSON.parse(localStorage.getItem("deliveryAddress") || "{}");

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // Create order when component mounts
  useEffect(() => {
    const createOrder = async () => {
      try {
        // Check if we have all required data
        if (
          !deliveryAddress.streetAddress ||
          !deliveryAddress.city ||
          !deliveryAddress.zipCode ||
          cartItems.length === 0 ||
          !token
        ) {
          console.error("Missing required data for order creation");
          setPaymentError("Missing address information or cart is empty");
          return;
        }

        // Prepare order data exactly as expected by the backend
        const orderData = {
          streetAddress: deliveryAddress.streetAddress,
          city: deliveryAddress.city,
          zipCode: deliveryAddress.zipCode,
          orderProducts: cartItems.map(item => ({
            productID: item.productID,
            quantity: item.cartQuantity
          }))
        };

        console.log("Creating order with data:", orderData);

        // Create the order
        const orderResponse = await requestServer(
          `${API_URL}/api/orders/create-order`,
          "POST",
          token,
          orderData
        );

        console.log("Order creation response:", orderResponse);

        if (!orderResponse.data?.success) {
          setPaymentError(orderResponse.data?.message || "Failed to create order");
          return;
        }

        // Store the orderID for later use
        const createdOrderID = orderResponse.data.data.orderID;
        setOrderID(createdOrderID);
        setOrderCreated(true);

        // Create payment intent with the new order ID
        const paymentResponse = await requestServer(
          `${API_URL}/api/payments/create-payment-intent`,
          "POST",
          token,
          { orderID: createdOrderID }
        );

        console.log("Payment intent creation response:", paymentResponse);

        if (!paymentResponse.data?.success) {
          setPaymentError(paymentResponse.data?.message || "Failed to create payment intent");
          return;
        }

        setClientSecret(paymentResponse.data.data.clientSecret);
      } catch (error) {
        console.error("Error creating order and payment:", error);
        setPaymentError(
          "An error occurred while setting up your payment. Please try again."
        );
      }
    };

    if (!orderCreated && cartItems.length > 0 && token && deliveryAddress?.streetAddress) {
      createOrder();
    }
  }, [cartItems, token, deliveryAddress, orderCreated]);

  // Handle payment submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    // Get card element
    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setPaymentError(error.message);
        setIsProcessing(false);
      } else if (paymentIntent.status === "succeeded") {
        // Payment succeeded, clear cart and redirect to confirmation page
        clearCart();
        navigate(`/order-confirmation/${orderID}`);
      } else {
        setPaymentError("Payment processing failed. Please try again.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("An unexpected error occurred. Please try again.");
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

              {/* Order items */}
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

              {/* Delivery details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                <p>{deliveryAddress.streetAddress}</p>
                <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}</p>
              </div>

              {/* Order totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h2>

              {paymentError && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                  {paymentError}
                </div>
              )}

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
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#9e2146',
                          },
                        },
                      }}
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Test card: 4242 4242 4242 4242, any future date, any 3 digits for CVC, any 5 digits for postal code
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !stripe || !clientSecret}
                  className={`w-full py-3 rounded font-medium ${
                    isProcessing || !stripe || !clientSecret
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
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
