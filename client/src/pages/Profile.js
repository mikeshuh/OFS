import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/OFS_logo.png"; // Make sure the logo image in the `src/assets/`
import discountImage from "../assets/discount.png"; //Discount image
import Navbar from "../components/Navbar";

const Profile = () => {
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
      <div style={styles.container}>
        <h1>Profile Page</h1>
        <p>First Name</p>
        <p>Last Name</p>
        <div style={styles.searchContainer}>
        <p>Email</p>
          {!viewMode && <input
            type="text"
            placeholder="Email Field (Hide if no edit)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />}
        </div>

       <div style={styles.searchContainer}>
        <p>Password</p>
        {!viewMode && <input
            type="text"
            placeholder="Pwd Field (Hide if no edit)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />}
        </div>

        {viewMode && <button style={styles.profileButton} onClick={EditButton}>
          View History
        </button>}

        {viewMode && <button style={styles.editButton} onClick={EditButton}>
          Edit Profile
        </button>}

        {!viewMode && <button style={styles.exitButton} onClick={EditButton}>
          Save Changes
        </button>}

        {!viewMode && <button style={styles.exitButton} onClick={EditButton}>
          Cancel Changes
        </button>}
      </div>
    </div>
  );
};

// 🏷️ Discount Banner
const DiscountBanner = () => {
  return (
    <div style={styles.discountBanner}>
      <img src={discountImage} alt="Discount" style={styles.discountImage} />

      {/* Two columns */}
      <div style={styles.discountTextContainer}>
        {/* Left side：10% OFF & With First Order */}
        <div style={styles.leftColumn}>
          <span style={styles.discountHighlight}>10% OFF</span>
          <br />
          <span style={styles.discountSubText}>With First Order</span>
        </div>

        {/* Right side：Code: WELCOME */}
        <div style={styles.rightColumn}>
          <span style={styles.discountCode}>Code: WELCOME</span>
        </div>
      </div>

      <button style={styles.claimButton} onClick={() => alert("Why you click me?")}>
        Claim NOW!!!
      </button>
    </div>
  );
};



// CSS
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 50px",
    backgroundColor: "#28a745", // Green
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
  },
  logoContainer: { flex: 1 },
  logo: { height: "50px" },
  navLinks: {
    flex: 2,
    display: "flex",
    justifyContent: "center",
    gap: "20px"
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "10px",
    transition: "color 0.3s ease",
  },
  searchContainer: {
    flex: 1.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px"
  },
  searchInput: {
    padding: "8px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    outline: "none",
    width: "180px"
  },
  searchButton: {
    backgroundColor: "#fff",
    border: "1px solid #28a745",
    color: "#28a745",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  },
  authButtons: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },

  button: {
    textDecoration: "none",
    backgroundColor: "#fff",
    color: "#28a745",
    padding: "8px 15px",
    borderRadius: "5px",
    fontSize: "14px",
    fontWeight: "bold",
    border: "2px solid #28a745",
    transition: "background-color 0.3s ease, color 0.3s ease",
  },

  // 🎉 Discount banner styles
  discountBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: "10px 15px",
    borderRadius: "30px",
    margin: "10px auto",
    width: "80%",
    maxWidth: "750px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    position: "relative",
    height: "60px"
  },
  discountImage: {
    height: "90px",
    position: "flex",
    left: "20px",
    top: "-10px"
  },
  // Make the text section horizontally aligned as a whole (left-right layout)
  discountTextContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: "20px"
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "10px",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1
  },
  rightColumn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1
  },
  discountHighlight: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000"
  },
  discountSubText: {
    fontSize: "15px",
    color: "#555"
  },
  discountCode: {
    fontSize: "30px",
    color: "#dc3545"
  },
  claimButton: {
    backgroundColor: "white",
    color: "#dc3545",
    border: "2px solid #dc3545",
    fontWeight: "bold",
    padding: "10px 20px",
    borderRadius: "20px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, color 0.3s ease"
  },

  container: {
    textAlign: "center",
    padding: "50px"
  },
  profileButton: {
    margin: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },

  editButton: {
    margin: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },

  exitButton: {
    margin: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  }
};
export default Profile;
