import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";
import requestServer from "../utils/Utility"
import DiscountBanner from "../components/DiscountBanner";

const Login = () => {
  const [errorMessage,setMessage] = useState("");
  const [formData,setFormData] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate();

  /*alert bar message*/
  const [loginError,setLoginError] = useState(false);
    const LoginError = (errorMessage) => {
      setLoginError(true);
      setMessage(errorMessage);
  }

  /*Form Data Action Listener*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  /*Login Function*/
  const loginDB = async (e) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    e.preventDefault();
    try {
      const response = await requestServer("http://localhost:5000/api/users/login", "POST", JWT_SECRET, formData);
      if (response.data?.success) {
        // Handle success login
        const data = await response.data;
        localStorage.setItem("authToken", data.data?.token);
        console.log(data.data?.token);
        navigate("/profile");
      } else {
        // Handle error response
        const errorData = response.data;
        LoginError(errorData?.message || "An error occurred. Please try again later.");
      }
    } catch (error) {
      LoginError("An error occurred. Please try again later.");
    }
  }
  return (
    <div>
      {/* Navi Bar */}
      <Navbar />

      {/* Discount */}
      <DiscountBanner />
      {/* Login Form Container */}
      <div style={styles.loginContainer}>
        <h1 style={styles.header}>User Login</h1>
        {/* Error Message */}
        {loginError && <div class="alert" style={styles.alert}>{errorMessage}</div>}
        {/* Login Form */}
        <form style={styles.form} onSubmit={loginDB}>
          <div style={styles.formGroup}>
            <div style ={styles.tableGroup}>
             <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              style={styles.input}
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>
          <button type="submit" style={styles.submitButton}>Login</button>
        </form>
      </div>
      <div style={styles.signupContainer}>
        <p>Don't have an account?</p>
        <Link to="/signup" style={styles.button} >Sign Up</Link>
      </div>
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
    margin: '0px 20vw 0px 20vw',

    fontSize: '14px',
    textAlign: "center",
    padding: "50px",
    alignItems: "center"
  },

  signupContainer:{
    textAlign: "center",
    padding: "20px"
  },
  alert:{
    color: 'red',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px'
  }
};

export default Login;
