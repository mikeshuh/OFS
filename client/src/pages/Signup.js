import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/OFS_logo.png"; // Make sure the logo image in the `src/assets/`
import discountImage from "../assets/discount.png"; //Discount image
import Navbar from "../components/Navbar";

const Signup = () => {
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
      {/* Signup Form */}
      <div style={styles.loginContainer}>
        <h1 style={styles.header}>New User Signup</h1>
        <form style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              style={styles.input}
            />
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
          <div style={styles.formGroup}>
            <label htmlFor="confirmed password" style={styles.label}>Confirmed Password:</label>
            <input
              type="passwordConfirmed"
              id="passwordConfirmed"
              name="passwordConfirmed"
              placeholder="Enter your password again"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="firstName" style={styles.label}>First Name:</label>
            <input
              type="firstName"
              id="firstName"
              name="firstName"
              placeholder="Enter your First Name"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="lastName" style={styles.label}>Last Name:</label>
            <input
              type="lastName"
              id="lastName"
              name="lastName"
              placeholder="Enter your Last Name"
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.submitButton}>Signup</button>
        </form>
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
  },
   label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
  },
  loginContainer: {
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '20px',
    textAlign: "center",
    padding: "50px"
  },
  signupContainer:{
    textAlign: "center",
    padding: "20px"
  }
};

export default Signup;
