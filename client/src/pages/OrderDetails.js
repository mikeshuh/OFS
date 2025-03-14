import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/OFS_logo.png"; // Make sure the logo image in the `src/assets/`
import discountImage from "../assets/discount.png"; //Discount image
import Navbar from "../components/Navbar.js";
import "../App.js";

function Orders() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);
};

const [viewMode, setView] = useState(true);
    const EditButton = () => {
            setView(!viewMode);
    };

const toOrder = () => {
  window.location.href="./orders";
}

  return (
    <div>
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="container">
        <h1>Order Details</h1>

        <table>
        <tr>
            <th>Order ID</th>
            <th>Total Cost</th>
            <th>Total Pounds</th>
            <th>Devlivery Fee?</th>
            <th>Date</th>
            <th>Status</th>
            <th>Address</th>
            <th>City</th>
            <th>Zip Code</th>
        </tr>
        <tr>
            <td>1</td>
            <td>10.68</td>
            <td>3.96</td>
            <td>Yes</td>
            <td>2025-03-01 12:54:39</td>
            <td>Delivered</td>
            <td>2 East William Street</td>
            <td>San Jose</td>
            <td>95112</td>
        </tr>
        </table>

        <h1>Cart Details</h1>
        <table>
        <tr>
            <th>Product</th>
            <th>Amount</th>
            <th>Total Cost</th>
            <th>Total Pounds</th>
        </tr>
        <tr>
            <td>Apple</td>
            <td>12</td>
            <td>10.68</td>
            <td>3.96</td>
        </tr>
        </table>
        
        <br/>

        <button className="editButton" onClick={toOrder}>
                Back
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

export default Orders;
