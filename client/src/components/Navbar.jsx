import logo from "../assets/OFS_logo.png";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { useGetProducts } from "./GetProducts"

function Navbar() {
  const auth = useAuth();
  const getProd = useGetProducts();
  const navigate = useNavigate();
  console.log(useGetProducts())
  console.log(useAuth())
  const { cartItemsCount, calculateTotal } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e) => {
    alert(`Searching for: ${searchQuery}`);
    console.log(getProd)
    const response = await getProd.getProductMatch(searchQuery);
    navigate("/products");
    window.location.reload(false);
  };

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="OFS Logo" className="h-10" />
          </Link>
        </div>

        {console.log("hi")}

        {/* Search Bar */}
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search for..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-4 pr-12 text-base border rounded-md"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Contact and Account */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div className="ml-2">
              <div className="text-sm text-gray-600">Contact Us:</div>
              <div className="text-sm font-medium">(+01) 111-111-1111</div>
            </div>
          </div>

          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div className="ml-2">
              <div className="text-sm text-gray-600">Account</div>
              {auth.loggedIn ? (
                <div className="flex gap-1 text-sm font-medium">
                  <Link to="/profile" className="hover:underline">Profile</Link>
                  <span>/</span>
                  <Link to="/logout" className="hover:underline">Logout</Link>
                </div>
              ) : (
                <div className="flex gap-1 text-sm font-medium">
                  <Link to="/login" className="hover:underline">Login</Link>
                  <span>/</span>
                  <Link to="/signup" className="hover:underline">Register</Link>
                </div>
              )}
            </div>
          </div>

          <Link to="/cart" className="flex items-center text-white bg-green-600 px-4 py-2 rounded relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="ml-2 text-base font-medium">
              {cartItemsCount > 0
                ? `Cart $${calculateTotal().toFixed(2)}`
                : 'Cart $0.00'
              }
            </span>

            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex justify-center bg-white shadow-sm">
        <div className="flex space-x-10 py-4">
          <Link to="/" className="text-gray-800 text-base font-medium hover:text-green-600 flex items-center">
            Home
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          <Link to="/products" className="text-gray-800 text-base font-medium hover:text-green-600 flex items-center">
            Products
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          <Link to="/about" className="text-gray-800 text-base font-medium hover:text-green-600 flex items-center">
            About Us
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
