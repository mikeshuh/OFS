import React, { useState } from "react";
import DiscountBanner from "../components/DiscountBanner";
import Navbar from "../components/Navbar.jsx";

import fruitImage from "../assets/fruits.jpg";

function Products() {

  const toProductDetails = () => {
    window.location.href="./productDetails";
  };

  const products = [
    {
      id: 1,
      name: "Almond Milk",
      category: "Milk",
      price: 80,
      rating: 4.8,
      reviews: 231,
      unit: "1 L",
    },
    {
      id: 2,
      name: "Wheat Flour",
      category: "Grain",
      price: 50,
      rating: 4.7,
      reviews: 198,
      unit: "1 Kg",
    },
    {
      id: 3,
      name: "Sunflower Oil",
      category: "Oil",
      price: 120,
      rating: 4.5,
      reviews: 182,
      unit: "1 L",
    },
    {
      id: 4,
      name: "Mix Vegetables",
      category: "Vegetables",
      price: 90,
      rating: 4.3,
      reviews: 156,
      unit: "2 Kg",
    },
    {
      id: 5,
      name: "Mix Chocolate Bread",
      category: "Grain",
      price: 50,
      rating: 4.7,
      reviews: 210,
      unit: "500 g",
    },
  ];

  return (
    <div>
      <Navbar />

      <DiscountBanner />

      <div className="flex-1 flex-col items-center justify-center text-center p-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Products Page!</h2>
        <p className="text-lg text-gray-600">Here you will find all our available products.</p>

      {/* Products List */}
      <div className="w-full px-4 md:px-12 py-6 mb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="bg-gray-50 rounded-lg p-2 mb-3">
                <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700 mb-2">{product.category}</span>
                <div className="h-40 w-full bg-gray-200 flex items-center justify-center mb-2">
                  <span className="text-gray-500 text-sm">{product.name}</span>
                </div>
                <p className="text-sm text-gray-500">{product.unit}</p>
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{product.name}</h3>
              <div className="flex items-center mb-2">
                <div className="flex text-amber-400">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                </div>
                <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">${product.price}</span>
              </div>
              <button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center" onClick={toProductDetails}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                </svg>
                Add to cart
              </button>
            </div>
          ))}
        </div>

      </div>

      </div>
    </div>
  );
};

export default Products;
