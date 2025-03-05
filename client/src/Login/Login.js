import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/OFS_logo.png'; // Ensure the logo image is in the `src/assets/` 
import discountImage from '../assets/discount.png'; // Discount image

const Login = () => {
  return (
    <div style={styles.pageContainer}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <Link to="/"><img src={logo} alt="OFS Logo" style={styles.logo} /></Link>
        <div style={styles.navLinks}>
          <Link to="/categories" style={styles.link}>Food Category</Link>
          <Link to="/cart" style={styles.link}>Shopping Cart</Link>
        </div>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search..."
            style={styles.searchInput}
          />
          <button style={styles.searchButton}>🔍</button>
        </div>
        <Link to="/signup" style={styles.button}>Sign Out</Link>
      </nav>

      {/* Discount Banner */}
      <DiscountBanner />

      {/* Login Form */}
      <div style={styles.loginContainer}>
        <h1 style={styles.header}>New User Login</h1>
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
          <button type="submit" style={styles.submitButton}>Login</button>
        </form>
      </div>
    </div>
  );
};

// 🏷️ Discount Banner
const DiscountBanner = () => {
  return (
    <div style={styles.discountBanner}>
      <img src={discountImage} alt="Discount" style={styles.discountImage} />
      <div style={styles.discountTextContainer}>
        <div style={styles.leftColumn}>
          <span style={styles.discountHighlight}>10% OFF</span>
          <br />
          <span style={styles.discountSubText}>With First Order</span>
        </div>
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

// Styles
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 50px',
    backgroundColor: '#28a745', // Green
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
  },
  logo: {
    height: '50px',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '10px',
    transition: 'color 0.3s ease',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  searchInput: {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    outline: 'none',
    width: '180px',
  },
  searchButton: {
    backgroundColor: '#fff',
    border: '1px solid #28a745',
    color: '#28a745',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  button: {
    textDecoration: 'none',
    backgroundColor: '#fff',
    color: '#28a745',
    padding: '8px 15px',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: '2px solid #28a745',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  discountBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: '10px 15px',
    borderRadius: '30px',
    margin: '20px auto',
    width: '80%',
    maxWidth: '750px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    height: '60px',
  },
  discountImage: {
    height: '90px',
    position: 'flex',
    left: '20px',
    top: '-10px',
  },
  discountTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: '20px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  rightColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  discountHighlight: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000',
  },
  discountSubText: {
    fontSize: '15px',
    color: '#555',
  },
  discountCode: {
    fontSize: '30px',
    color: '#dc3545',
  },
  claimButton: {
    backgroundColor: 'white',
    color: '#dc3545',
    border: '2px solid #dc3545',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    margin: '20px',
    width: '400px',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '20px',
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    outline: 'none',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Login;