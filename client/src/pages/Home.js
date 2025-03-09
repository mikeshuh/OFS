import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.js";
import DiscountBanner from "../components/DiscountBanner.js";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />

      {/* Main page information */}
      <div style={styles.container}>
        <h1>Welcome to OFS Online Grocery Store</h1>
        <p>Order fresh groceries online and get them delivered to your doorstep.</p>
        <button style={styles.shopButton}
        onClick={() => navigate("/products")}
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
};

// CSS
const styles = {

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

 container: {
    textAlign: "center",
    padding: "50px"
  },
  shopButton: {
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

export default Home;
