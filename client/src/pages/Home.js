import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/OFS_logo.png"; // 确保你有 logo 图片，并放在 `src/assets/` 目录下

const Home = () => {
  return (
    <div>
      {/* 顶部导航栏 */}
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="OFS Logo" style={styles.logo} />
        </div>
        <div style={styles.navLinks}>
          <Link to="/categories" style={styles.link}>Food Category</Link>
          <Link to="/cart" style={styles.link}>Shopping Cart</Link>
          <Link to="/profile" style={styles.link}>User Profile</Link>
        </div>
        <div style={styles.authButtons}>
          <Link to="/login" style={styles.button}>Log In</Link>
          <Link to="/signup" style={styles.button}>Sign Up</Link>
        </div>
      </nav>

      {/* 主页内容 */}
      <div style={styles.container}>
        <h1>Welcome to OFS Online Grocery Store</h1>
        <p>Order fresh groceries online and get them delivered to your doorstep.</p>
        <button style={styles.shopButton} onClick={() => alert("Start Shopping!")}>
          Start Shopping
        </button>
      </div>
    </div>
  );
};

// CSS 样式
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 50px",
    backgroundColor: "#f8f9fa",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
  },
  logoContainer: {
    flex: 1
  },
  logo: {
    height: "50px"
  },
  navLinks: {
    flex: 2,
    display: "flex",
    justifyContent: "center",
    gap: "20px"
  },
  authButtons: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "10px"
  },
  button: {
    textDecoration: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "8px 15px",
    borderRadius: "5px",
    fontSize: "14px",
    fontWeight: "bold"
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
    cursor: "pointer"
  }
};

export default Home;
