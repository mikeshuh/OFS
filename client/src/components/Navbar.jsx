import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/OFS_logo.png";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

function Navbar() {
  const { auth, loggedIn } = useAuth();
  const { cartItemsCount, calculateTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const homeNav = [["login", "Login"], ["signup", "Sign up"]];
  const homeNavLoggedIn = [
    ["profile", "Profile"],
    ["orders", "Order History"],
    ["map", "Check Delivery"]
  ];

  /*
    These are the functions for the dropdown menu
    DropdownBar is a reusable component that allows input and generates a dropdown menu
    DropdownContent is the input for the dropdown menu
    HomeContent is the dropdown menus for the Home menu
  */

  function DropdownBar({ children, href, DropdownContent }) {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef(null);

    // This timeout is used to delay the closing of the dropdown menu
    // This resets the timer for closing if the mouse reenter the dropdown menu
    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setOpen(true);
    };

    // This checks the timeout for closing the dropdown menu
    const handleMouseLeave = () => {
      timeoutRef.current = setTimeout(() => {
        setOpen(false);
      }, 100);
    };

    return (
      <div className="text-gray-800 text-base font-medium flex justify-center">
        <div
          className="group relative h-fit w-fit"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* The style is for the green underline bar*/}
          <Link to={href} className="relative">
            {children}
            <span
              style={{
                transform: open ? "scaleX(1)" : "scaleX(0)",
              }}
              className="absolute -bottom-2 -left-0 -right-0 h-1 origin-left rounded-full bg-green-300 transition-transform duration-300 ease-in-out group-hover:w-full"
            />
          </Link>
          {open &&
            (!loading ? (
              <div
                className="absolute left-0 top-7 bg-white w-40 mt-3 rounded-md shadow-lg z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownContent />
              </div>
            ) : (
              // Loading spinner
              <div
                className="absolute left-0 bg-white w-40 mt-3 rounded-md shadow-lg z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center justify-center p-4">
                  <svg
                    className="animate-spin h-5 w-5 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8A8.009 8.009 0 0 1 12 20z"
                    />
                  </svg>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Renders the dropdown content for the Home menu
  const HomeContent = () => {
    return (
      <div className="flex flex-col py-2">
        {loggedIn ? (homeNav.map(([path, name]) => (
          <Link
            key={path}
            to={`/${path}`}
            className="block px-6 py-2 text-gray-800 hover:bg-green-100 hover:text-green-600 transition-colors duration-200"
          >
            {name}
          </Link>
        ))) : (
          (homeNavLoggedIn.map(([path, name]) => (
            <Link
              key={path}
              to={`/${path}`}
              className="block px-6 py-2 text-gray-800 hover:bg-green-100 hover:text-green-600 transition-colors duration-200"
            >
              {name}
            </Link>
          )))
        )}
      </div>
    );
  };

  // Figure out current category from the path (/products/:category)
  const pathSegments = location.pathname.split("/");
  const currentCategory =
    pathSegments[1] === "products" && pathSegments[2]
      ? pathSegments[2]
      : "all";

  // Local state for the input, synced with URL ?search=
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("search") || "");
  }, [location.search]);

  const handleSearch = () => {
    const term = searchQuery.trim();
    if (term) {
      navigate(
        `/products/${currentCategory}?search=${encodeURIComponent(term)}`
      );
    } else {
      navigate(`/products/${currentCategory}`);
    }
  };


  const handleClear = () => {
    setSearchQuery("");
    navigate(`/products/${currentCategory}`);
  };

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="OFS Logo" className="h-10" />
        </Link>

        {/* Search Bar */}
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search for..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full py-2 pl-4 pr-12 text-base border rounded-md"
          />

          {/* Clear (×) button */}
          {searchQuery && (
            <button
              onClick={handleClear}
              aria-label="Clear search"
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Search icon */}
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Contact & Account */}
        <div className="flex items-center space-x-8">
          {/* Contact */}
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div className="ml-2">
              <div className="text-sm text-gray-600">Contact Us:</div>
              <div className="text-sm font-medium">(+01) 111-111-1111</div>
            </div>
          </div>

          {/* Account */}
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div className="ml-2">
              <div className="text-sm text-gray-600">Account</div>
              {auth.loggedIn ? (
                <div className="flex gap-1 text-sm font-medium">
                  <Link to="/profile" className="hover:underline">
                    Profile
                  </Link>
                  <span>/</span>
                  <Link to="/logout" className="hover:underline">
                    Logout
                  </Link>
                </div>
              ) : (
                <div className="flex gap-1 text-sm font-medium">
                  <Link to="/login" className="hover:underline">
                    Login
                  </Link>
                  <span>/</span>
                  <Link to="/signup" className="hover:underline">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center text-white bg-green-600 px-4 py-2 rounded relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="ml-2 text-base font-medium">
              {cartItemsCount > 0
                ? `Cart $${calculateTotal().toFixed(2)}`
                : "Cart $0.00"}
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
          <DropdownBar href="/" DropdownContent={HomeContent}>
            Home
          </DropdownBar>
          <Link
            to="/products/all"
            className="text-gray-800 text-base font-medium hover:text-green-600 flex items-center"
          >
            Products
          </Link>
          <Link
            to="/about"
            className="text-gray-800 text-base font-medium hover:text-green-600 flex items-center"
          >
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
