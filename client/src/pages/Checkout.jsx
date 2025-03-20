import React, { useState } from "react";
import DiscountBanner from "../components/DiscountBanner";
import Navbar from "../components/Navbar.jsx";

function Checkout() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };

  const [method1, setView1] = useState(true);
  const [method2, setView2] = useState(false);

    const changeMethod1 = () => {
      if (!method1) {
        setView1(!method1);
      }
      if (method2) {
        setView2(!method2);
      }
    };

    const changeMethod2 = () => {
      if (!method2) {
      setView2(!method2);
    }
    if (method1) {
      setView1(!method1);
    }
  };

  const toTransaction = () => {
    window.location.href="./orders";
  };

  const toCart = () => {
    window.location.href="./cart";
  };

  return (
    <div classname="min-h-screen flex flex-col">
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="flex-col flex-1 justify-center items-center text-center px-4">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
      <p>Choose a payment method</p>
      
      <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={changeMethod1}>
          Method1
        </button>
        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={changeMethod2}>
          Method2
        </button>

      <div className="flex flex-1 justify-center items-center px-4">
      
      
      <div className="w-full max-w-md content-center ml-[10px] mr-[10px] bg-white items-center shadow-md rounded-xl p-8">
        
      <div className="flex flex-col text-left">
        {method1 && <label htmlFor="CardNum"
        className="mb-2 text-sm font-medium text-gray-700">Method1 Card Number</label>}
          {method1 && <input
            type="text"
            id="CardNum"
            name="CardNum"
            placeholder="Enter your credit card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-[15px] w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />}
      </div>

      <div className="flex flex-col text-left">
        {method1 && <label htmlFor="SecurityCardNum"
        className="mb-2 text-sm font-medium text-gray-700">Method1 Card Security Number</label>}
          {method1 && <input
            type="text"
            id="SecurityCardNum"
            name="SecurityCardNum"
            maxlength="3"
            minlength="3"
            placeholder="Enter your security card number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-[15px] w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />}
      </div>

      <div className="flex flex-col text-left">
        {method1 && <label htmlFor="ValidDate"
        className="mb-2 text-sm font-medium text-gray-700">Method1 Card Valid Date</label>}
          {method1 && <input
            type="text"
            id="ValidDate"
            name="ValidDate"
            placeholder="Enter credit card Date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-[15px] w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />}
      </div>

      <div className="flex flex-col text-left">
        {method1 && <label htmlFor="Address"
        className="mb-2 text-sm font-medium text-gray-700">Method1 Address</label>}
          {method1 && <input
            type="text"
            id="Address"
            name="Address"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-[15px] w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />}
      </div>

      <div className="flex flex-col text-left">
        {method2 && <label htmlFor="M2Field"
        className="mb-2 text-sm font-medium text-gray-700">Method2 Field</label>}
          {method2 && <input
            type="text"
            id="M2Field"
            name="M2Field"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-[15px] w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />}
      </div>     
        </div>

        </div>

        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={toTransaction}>
          Confirm
        </button>

        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition-colors duration-300" onClick={toCart}>
          Cancel
        </button>

      </div>
    </div>
  );
};

/*
w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300
*/

export default Checkout;
