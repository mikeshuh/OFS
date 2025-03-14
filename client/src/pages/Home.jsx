import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Banner from "../assets/banner.webp";

const Home = () => {
  const navigate = useNavigate();

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

  const features = [
    {
      title: "Top Rank Farms",
      description: "Farm-fresh produce to bring quality and health to your family's table, every day.",
    },
    {
      title: "Organic Certified",
      description: "Guaranteed pure, naturally grown products for a healthier, chemical-free lifestyle.",
    },
    {
      title: "Fast Delivery",
      description: "Fresh groceries at your doorstep in no time, ensuring convenience without the wait!",
    },
    {
      title: "Trusted Products",
      description: "Handpicked, high-quality items you can rely on for your family's well-being.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar - with sticky positioning */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Banner Section - Full Width */}
      <div className="w-full px-4 md:px-12 py-4">
        <div className="relative w-full rounded-lg overflow-hidden">
          <div className="w-full aspect-[2.5/1] relative">
            <img
              src={Banner}
              alt="Fresh Vegetables"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full px-6 md:px-12 text-right">
              <div className="max-w-lg mr-10 md:mr-20 lg:mr-40 ml-auto">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Farm Fresh Vegetables & Food 100% Organic.
                </h1>
                <p className="text-lg md:text-xl text-white mb-6 drop-shadow-lg">Always fresh product for you</p>
                <button
                  onClick={() => navigate("/products")}
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 md:py-3 md:px-6 rounded"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full px-4 md:px-12 py-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center">
            <div className="border-t border-gray-300 w-32"></div>
            <h2 className="mx-4 text-xl text-green-600 italic">When health is organic</h2>
            <div className="border-t border-gray-300 w-32"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">{index + 1}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Cards */}
      <div className="w-full px-4 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative rounded overflow-hidden shadow-md">
            <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">Fruit Sale Image</span>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-6 bg-gradient-to-r from-black/50 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2">Fresh Fruit<br />Sales Up To<br />30%</h3>
              <button className="bg-white hover:bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-4 rounded w-24 mt-2">
                Shop Now
              </button>
            </div>
          </div>

          <div className="relative rounded overflow-hidden shadow-md">
            <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">Farm Fresh Image</span>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-6 bg-gradient-to-r from-black/50 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2">Farm Fresh<br />Vegetables<br />For Everyday</h3>
              <button className="bg-white hover:bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-4 rounded w-24 mt-2">
                Shop Now
              </button>
            </div>
          </div>

          <div className="relative rounded overflow-hidden shadow-md">
            <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">Soya Milk Image</span>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-6 bg-gradient-to-r from-black/50 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2">Fresh 100%<br />Organic<br />Soya Milk</h3>
              <button className="bg-white hover:bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-4 rounded w-24 mt-2">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Free Delivery Banner */}
      <div className="bg-gradient-to-r from-amber-200 to-amber-100 py-6 my-10 w-full">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Free Delivery When You Spend Over $60</h2>
        </div>
      </div>

      {/* Recent Products */}
      <div className="w-full px-4 md:px-12 py-6 mb-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 relative inline-block">
            Recent Product
            <div className="absolute left-0 right-0 border-t border-gray-300 border-dashed top-1/2 -z-10"></div>
          </h2>
        </div>

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
              <button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                </svg>
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Grocery Products */}
      <div className="w-full px-4 md:px-12 py-6 mb-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 relative inline-block">
            Daily Grocery Product
            <div className="absolute left-0 right-0 border-t border-gray-300 border-dashed top-1/2 -z-10"></div>
          </h2>
        </div>

      </div>
    </div>
  );
};

export default Home;
