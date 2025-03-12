import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/OFS_logo.png"; // Make sure the logo image in the `src/assets/`
import discountImage from "../assets/discount.png"; //Discount image
import Navbar from "../components/Navbar.js";
import "../App.js";

function ShoppingCart() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
};

const [viewMode, setView] = useState(true);
    const EditButton = () => {
            setView(!viewMode);
    };

const toCheckout = () => {
  window.location.href="./Checkout";
};

const discardCart = () => {
  alert("This function should cancel shopping")
}

  return (
    <div>
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="container">
        <h1>Shopping Cart</h1>
        <table>
        <tr>
            <th>Item</th>
            <th>Individual Cost</th>
            <th>Individual Pounds</th>
            <th>Quantity</th>
        </tr>
        <tr>
            <td>Apple</td>
            <td>0.89</td>
            <td>0.33</td>
            <td>12
            {!viewMode && <input
              type="number"
              placeholder="Num"
              min="0"
              max="999"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="numInput"/>}
            </td>
        </tr>
        </table>
        
        {viewMode && <button className="purchaseButton" onClick={toCheckout} >
          Purchase
        </button>}
        
        {viewMode && <button className="editButton" onClick={EditButton}>
          Edit Cart
        </button>}

        {viewMode && <button className="editButton" onClick={discardCart}>
          Discard Cart
        </button>}

        {!viewMode && <button className="exitButton" onClick={EditButton}>
          Save Changes
        </button>}

        {!viewMode && <button className="exitButton" onClick={EditButton}>
          Cancel Changes
        </button>}

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

export default ShoppingCart;
