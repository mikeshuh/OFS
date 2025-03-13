import logo from "../assets/OFS_logo.png";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

function Navbar() {
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };

  return (
    <nav className="flex items-center justify-between py-[15px] px-[50px] bg-green-600 shadow-md text-center">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/">
          <img src={logo} alt="OFS Logo" className="h-[50px]" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-2 flex whitespace-nowrap">
        <Link
          to="/"
          className="text-white text-[16px] font-bold px-[10px] py-[10px] no-underline"
        >
          Home
        </Link>
        <Link
          to="/categories"
          className="text-white text-[16px] font-bold px-[10px] py-[10px] no-underline"
        >
          Food Categories
        </Link>
        <Link
          to="/cart"
          className="text-white text-[16px] font-bold px-[10px] py-[10px] no-underline"
        >
          Shopping Cart
        </Link>
        <Link
          to="/profile"
          className="text-white text-[16px] font-bold px-[10px] py-[10px] no-underline"
        >
          User Profile
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-2 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white px-[12px] py-[8px] text-[14px] border border-gray-300 rounded-[5px] outline-none w-[400px]"
        />
        <button
          onClick={handleSearch}
          className="bg-white border border-green-600 text-green-600 px-[12px] py-[8px] text-[14px] cursor-pointer transition duration-300 ml-2 rounded-[5px] block"
        >
          🔍
        </button>
      </div>

      {/* Auth Buttons */}
      <div className="flex-2 flex justify-end gap-[10px]">
        {auth.loggedIn ? (
          <Link
            to="/logout"
            className="rounded-[5px] bg-white text-green-600 text-[14px] font-bold no-underline text-center py-[12px] px-[20px] transition duration-300"
          >
            Log Out
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-[5px] bg-white text-green-600 text-[14px] font-bold no-underline text-center py-[12px] px-[20px] transition duration-300"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="rounded-[5px] bg-white text-green-600 text-[14px] font-bold no-underline text-center py-[12px] px-[20px] transition duration-300"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
