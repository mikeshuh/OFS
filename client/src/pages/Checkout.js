import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/OFS_logo.png"; // Make sure the logo image in the `src/assets/`
import discountImage from "../assets/discount.png"; //Discount image
import Navbar from "../components/Navbar.js";
import "../App.js";

function Checkout() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
};

const [method1, setView1] = useState(true);
const [method2, setView2] = useState(false);

    const changeMethod1 = () => {
      if (!method1) {
        setView1(!method1);
      }
      if (method2) {
        setView2(!method2);
      }
    };

    const changeMethod2 = () => {
      if (!method2) {
      setView2(!method2);
    }
    if (method1) {
      setView1(!method1);
    }
  };

const toTransaction = () => {
    window.location.href="./orders";
};

const toCart = () => {
  window.location.href="./cart";
};

  return (
    <div>
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="container">
        <h1>Checkout</h1>
        
        
        <button className="editButton" onClick={changeMethod1}>
          Method1
        </button>
        
        <button className="editButton" onClick={changeMethod2}>
          Method2
        </button>

        <br/>

        {method1 && <p>Method1 Card Number</p>}
          {method1 && <input
            type="text"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />}

        {method1 && <p>Method1 Card Security Number</p>}
          {method1 && <input
            type="text"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />}

        {method1 && <p>Method1 Card Valid Date</p>}
          {method1 && <input
            type="text"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />}

        {method1 && <p>Method1 Address</p>}
          {method1 && <input
            type="text"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />}

        {method2 && <p>Method2 Field</p>}
          {method2 && <input
            type="text"
            placeholder="Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />}

        <br/>

        <button className="purchaseButton" onClick={toTransaction}>
          Confirm
        </button>

        <button className="exitButton" onClick={toCart}>
          Cancel
        </button>

      </div>
    </div>
  );
};

// 🏷️ Discount Banner
function DiscountBanner() {
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

      <button className="claimButton" onClick={() => alert("Why you click me?")}>
        Claim NOW!!!
      </button>
    </div>
  );
};

export default Checkout;
