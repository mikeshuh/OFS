import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/OFS_logo.png"; // Make sure the logo image in the `src/assets/`
import discountImage from "../assets/discount.png"; //Discount image
import Navbar from "../components/Navbar";


const Login = () => {
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
      {/* Login Form */}
      <div style={styles.loginContainer}>
        <h1 style={styles.header}>New User Login</h1>
        <form style={styles.form}>
          <div style={styles.formGroup}>
            <div style ={styles.tableGroup}>
             <label htmlFor="username" style={styles.label}>Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              style={styles.input}
            />
            </div>

          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.submitButton}>Login</button>
        </form>
      </div>
      <div style={styles.signupContainer}>
        <p>Don't have an account?</p>
        <Link to="/signup" style={styles.button}>Sign Up</Link>
      </div>
    </div>
  );
};

// 🏷️ Discount Banner
const DiscountBanner = () => {

  /*Warning Message*/
  const navigate = useNavigate();

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

      <button style={styles.claimButton}
      onClick={() => alert("Discount claimed!")}
      >
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
  discountRight: {
    fontSize: "25px",
    color: "#dc3545"
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
  },
  label: {
    display: 'grid',
    marginBottom: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555',
  },
  loginContainer: {
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '20px',
    fontSize: '14px',
    textAlign: "center",
    padding: "50px"
  },

  signupContainer:{
    textAlign: "center",
    padding: "20px"
  }
};

export default Login;
