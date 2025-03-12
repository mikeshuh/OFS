import React from "react";
import Navbar from "../components/Navbar";
const Products = () => {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Products Page!</h2>
        <p className="text-lg text-gray-600">Here you will find all our available products.</p>
      </div>
    </div>
  );
};

export default Products;
