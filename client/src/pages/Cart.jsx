<<<<<<< HEAD
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../components/CartContext";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal
  } = useCart();

  console.log("Cart rendering with items:", cartItems);
=======
import React, { useState, useEffect } from "react";
import DiscountBanner from "../components/DiscountBanner";
import Navbar from "../components/Navbar.jsx";

function ShoppingCart() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };

  const [viewMode, setView] = useState(true);
    const EditButton = () => {
            setView(!viewMode);
    };
>>>>>>> 99cad11dbc2c87e2fbe92bc54016ccd97d718cc6

  const toCheckout = () => {
    window.location.href="./checkout";
  };

<<<<<<< HEAD
  // If cart is empty, show message and link to products
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link
              to="/products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to safely render binary image data
  const renderProductImage = (item) => {
    try {
      if (item.imageBinary) {
        return (
          <img
            src={`data:image/png;base64,${Buffer.from(item.imageBinary).toString('base64')}`}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        );
      }
    } catch (err) {
      console.error("Error rendering image:", err);
    }

    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
        {item.name}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Cart Items ({cartItems.length})</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y">
                {cartItems.map(item => (
                  <div key={item.productID} className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full md:w-24 h-24 bg-gray-200 rounded overflow-hidden">
                        {renderProductImage(item)}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">Category: {item.category}</p>
                        <p className="text-sm text-gray-500">Weight: {item.pounds} lbs</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.productID, item.cartQuantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-l border text-gray-600 hover:bg-gray-100"
                              disabled={item.cartQuantity <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={item.quantity}
                              value={item.cartQuantity}
                              onChange={(e) => updateQuantity(item.productID, parseInt(e.target.value) || 1)}
                              className="w-12 h-8 border-t border-b text-center text-sm"
                            />
                            <button
                              onClick={() => updateQuantity(item.productID, item.cartQuantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-r border text-gray-600 hover:bg-gray-100"
                              disabled={item.cartQuantity >= item.quantity}
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-800">
                              ${(parseFloat(item.price) * item.cartQuantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${parseFloat(item.price).toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div>
                        <button
                          onClick={() => removeFromCart(item.productID)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Link to="/products" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(calculateTotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${(calculateTotal() * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-medium" onClick={toCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
=======
  const discardCart = () => {
    alert("This function should cancel shopping");
  };

  return (
    <div classname="flex flex-col min-h-screen">
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="flex-1 flex-col items-center justify-center text-center p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
        
        <table className="mx-auto border-collapse border-[3px] border-solid border-gray-500 font-size: 16px">
        <tr className="border-[#28a745]">
            <th className="w-[150px] h-[45px] text-white bg-gray-500">Item</th>
            <th className="w-[150px] h-[45px] text-white bg-gray-500">Individual Cost</th>
            <th className="w-[150px] h-[45px] text-white bg-gray-500">Individual Pounds</th>
            <th className="w-[150px] h-[45px] text-white bg-gray-500">Quantity</th>
        </tr>
        <tr className="border-[#28a745]">
            <td className="w-[150px] h-[85px]">Apple</td>
            <td className="w-[150px] h-[85px]">0.89</td>
            <td className="w-[150px] h-[85px]">0.33</td>
            <td className="w-[150px] h-[85px]">12
            {!viewMode && <input
              type="number"
              placeholder="Num"
              min="0"
              max="999"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-[10px] border w-[70px]
              px-3 py-2 border-solid border-[#ddd]"/>}
            </td>
        </tr>
        </table>
        
        {viewMode && <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={toCheckout} >
          Purchase
        </button>}
        
        {viewMode && <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={EditButton}>
          Edit Cart
        </button>}

        {viewMode && <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={discardCart}>
          Discard Cart
        </button>}

        {!viewMode && <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={EditButton}>
          Save Changes
        </button>}

        {!viewMode && <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={EditButton}>
          Cancel Changes
        </button>}

>>>>>>> 99cad11dbc2c87e2fbe92bc54016ccd97d718cc6
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Cart;
=======
export default ShoppingCart;
>>>>>>> 99cad11dbc2c87e2fbe92bc54016ccd97d718cc6
