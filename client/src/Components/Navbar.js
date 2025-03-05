import logo from "../assets/OFS_logo.png"; // Make sure the logo image in the `src/assets/`
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import "./Navbar.css"

function Navbar(){

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };

  return(
  <nav className="navbar">
    <div className="logoContainer">
      <img src={logo} alt="OFS Logo" className="logo"/>
    </div>
    <div className="navLinks">
      <Link to="/" className="navLink">Home</Link>
      <Link to="/categories" className="navLink">Food Categories</Link>
      <Link to="/cart" className="navLink">Shopping Cart</Link>
      <Link to="/profile" className="navLink">User Profile</Link>
    </div>
    <div className="searchContainer">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="searchInput"
      />
      <button className="searchButton" onClick={handleSearch}>🔍</button>
    </div>
    <div className="navLinks">
      <Link to="/login" className="navLink">Log In</Link>
      <Link to="/signup" className="navLink">Sign Up</Link>
    </div>
  </nav>
  )
}

export default Navbar
