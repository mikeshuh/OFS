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

const toOrderDetails = () => {
  window.location.href="./orderDetails";
}

  return (
    <div>
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="container">
        <h1>Orders</h1>
        <table>
        <tr>
            <th>Order ID</th>
            <th>Total Cost</th>
            <th>Date</th>
            <th>Details</th>
        </tr>
        <tr>
            <td>1</td>
            <td>10.68</td>
            <td>2025-03-01 12:54:39</td>
            <td>
            <button className="editButton" onClick={toOrderDetails}>
                View
            </button>
            </td>
        </tr>
        </table>
        
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
