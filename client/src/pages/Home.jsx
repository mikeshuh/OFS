import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import DiscountBanner from "../components/DiscountBanner.jsx";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Discount Banner */}
      <DiscountBanner />

      {/* Main Page Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Welcome to OFS Online Grocery Store
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Order fresh groceries online and get them delivered to your doorstep.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
};

export default Home;
