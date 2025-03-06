import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/OFS_logo.png"; // Make sure the logo image in the `src/assets/`
import discountImage from "../assets/discount.png"; //Discount image
import Navbar from "../components/Navbar.js";
import "../App.js";

function Home (){
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
  };

  return (
    <div>
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="container">
        <h1>Welcome to OFS Online Grocery Store</h1>
        <p>Order fresh groceries online and get them delivered to your doorstep.</p>
        <button className="shopButton"
        onClick={() => navigate("/products")}
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
};

// 🏷️ Discount Banner
function DiscountBanner () {

  /*Warning Message*/
  const navigate = useNavigate();

  return (
    <div className="discountBanner">
      <img src={discountImage} alt="Discount" className="discountImage" />

      {/* Two columns */}
      <div className="discountTextContainer">
        {/* Left side：10% OFF & With First Order */}
        <div className="leftColumn">
          <span className="discountHighlight">10% OFF</span>
          <br />
          <span className="discountSubText">With First Order</span>
        </div>

        {/* Right side：Code: WELCOME */}
        <div className="rightColumn">
          <span className="discountCode">Code: WELCOME</span>
        </div>
      </div>

      <button className="claimButton"
      onClick={() => alert("Discount claimed!")}
      >
        Claim NOW!!!
      </button>
    </div>
  );
};

export default Home;
