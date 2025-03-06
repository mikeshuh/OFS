import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/OFS_logo.png"; // Make sure the logo image in the `src/assets/`
import discountImage from "../assets/discount.png"; //Discount image
import Navbar from "../components/Navbar";
import "../App.js";

function Profile() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Searching for: ${searchQuery}`);


};

const [viewMode, setView] = useState(true);

    const EditButton = () => {
            setView(!viewMode);
};


  return (
    <div>
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div className="container">
        <h1>Profile Page</h1>
        <p>First Name</p>
        <p>Last Name</p>
        
        
        <p>Email</p>
          {!viewMode && <input
            type="text"
            placeholder="Email Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />}   

        <p>Password</p>
        {!viewMode && <input
            type="text"
            placeholder="Pwd Field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
          />}
        <br/>
        {viewMode && <button className="profileButton" onClick={EditButton}>
          View History
        </button>}

        {viewMode && <button className="editButton" onClick={EditButton}>
          Edit Profile
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

export default Profile;
