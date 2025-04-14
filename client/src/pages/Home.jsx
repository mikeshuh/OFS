import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import Banner from "../assets/banner.jpg";
import fruitImage from "../assets/fruits.jpg";
import vegetablesImage from "../assets/vegetables.jpg";
import dairyImage from "../assets/dairy.jpg";
import deliveryImage from "../assets/delivery.jpg";


function Home() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Sample products data
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
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
    {
      title: "Organic Certified",
      description: "Guaranteed pure, naturally grown products for a healthier, chemical-free lifestyle.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Fast Delivery",
      description: "Fresh groceries at your doorstep in no time, ensuring convenience without the wait!",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
          <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104a1.837 1.837 0 00-1.47-.725H15.75z" />
          <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
      ),
    },
    {
      title: "Trusted Products",
      description: "Handpicked, high-quality items you can rely on for your family's well-being.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
          <path fillRule="evenodd" d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 15.586 19.293 5.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar - with sticky positioning */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Banner Section */}
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
              <div className="max-w-lg mr-10 sm:mr-10 md:mr-20 lg:mr-40 xl:mr-50 2xl:mr-60 ml-auto">
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
            <div className="border-t border-green-500 w-32"></div>
            <h2 className="mx-4 text-2xl text-green-600 italic font-medium">When health is organic</h2>
            <div className="border-t border-green-500 w-32"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="text-green-600 flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-700 text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Category Cards */}
      <div className="w-full px-4 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative rounded overflow-hidden shadow-md">
            <div className="w-full h-96 overflow-hidden">
              <img
                src={fruitImage}
                alt="Fresh Fruits"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-6 bg-gradient-to-r from-black/50 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2">Fresh Fruit<br />Direct To Your<br />Doorstep</h3>
              <button className="bg-white hover:bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-4 rounded w-24 mt-2"
                onClick={() => navigate("/products/fruit")}
              >
                Shop Now
              </button>
            </div>
          </div>
          <div className="relative rounded overflow-hidden shadow-md">
            <div className="w-full h-96 overflow-hidden">
              <img
                src={vegetablesImage}
                alt="Farm Fresh Vegetables"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-6 bg-gradient-to-r from-black/50 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2">Farm Fresh<br />Vegetables<br />For Everyday</h3>
              <button className="bg-white hover:bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-4 rounded w-24 mt-2"
                onClick={() => navigate("/products/vegetable")}
              >
                Shop Now
              </button>
            </div>
          </div>
          <div className="relative rounded overflow-hidden shadow-md">
            <div className="w-full h-96 overflow-hidden">
              <img
                src={dairyImage}
                alt="Organic Dairy Products"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-6 bg-gradient-to-r from-black/50 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2">Cruelty Free<br />100% Organic<br />Dairy Products</h3>
              <button className="bg-white hover:bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-4 rounded w-24 mt-2"
                onClick={() => navigate("/products/dairy")}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Free Delivery Banner */}
      <div className="bg-gradient-to-r from-amber-200 to-amber-100 py-6 my-10 w-full">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Free Delivery When Your Order is Under 20 lbs!</h2>
        </div>
      </div>

      {/* Delivery Area Section */}
      <div className="w-full px-4 md:px-12 py-4">
        <div className="relative w-full rounded-lg overflow-hidden">
          <div className="w-full aspect-[2.5/1] relative">
            <img
              src={deliveryImage} // Background image
              alt="Delivery Area"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full px-6 md:px-12 text-right"> {/* Align text to the right */}
              <div className="max-w-lg mr-10 sm:mr-10 md:mr-20 lg:mr-40 xl:mr-50 2xl:mr-60 ml-auto"> {/* Move text to the right */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Check If We Deliver To Your Area
                </h1>
                <p className="text-lg md:text-xl text-white mb-6 drop-shadow-lg">
                  Enter your location and find out if you're in our delivery zone.
                </p>
                <button
                  onClick={() => navigate("/map")}
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 md:py-3 md:px-6 rounded"
                >
                  View Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Featured Products */}
      <div className="w-full px-4 md:px-12 py-6 mb-10">
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          title="Featured Products"
        />
      </div>
    </div>
  );
};

export default Home;
