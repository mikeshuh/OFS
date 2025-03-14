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
    <div classname="flex flex-col min-h-screen">
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="flex-1 flex-col items-center justify-center text-center p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
        
        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300" onClick={changeMethod1}>
          Method1
        </button>
        
        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300" onClick={changeMethod2}>
          Method2
        </button>

        <br/>

        {method1 && <p>Method1 Card Number</p>}
          {method1 && <input
            type="text"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border w-[180px] px-3 py-2 border-solid border-[#ddd]"
          />}

        {method1 && <p>Method1 Card Security Number</p>}
          {method1 && <input
            type="text"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border w-[180px] px-3 py-2 border-solid border-[#ddd]"
          />}

        {method1 && <p>Method1 Card Valid Date</p>}
          {method1 && <input
            type="text"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border w-[180px] px-3 py-2 border-solid border-[#ddd]"
          />}

        {method1 && <p>Method1 Address</p>}
          {method1 && <input
            type="text"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border w-[180px] px-3 py-2 border-solid border-[#ddd]"
          />}

        {method2 && <p>Method2 Field</p>}
          {method2 && <input
            type="text"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border w-[180px] px-3 py-2 border-solid border-[#ddd]"
          />}

        <br/>

        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300" onClick={toTransaction}>
          Confirm
        </button>

        <button className="m-[10px] bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300" onClick={toCart}>
          Cancel
        </button>

      </div>
    </div>
  );
};

export default Checkout;
