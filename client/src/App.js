import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products"
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<div>Food Category Page</div>} />
        <Route path="/cart" element={<div>Shopping Cart Page</div>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/signup" element={<div>Sign Up Page</div>} />
        <Route path="/products" element={<div>Products</div>} />
      </Routes>
    </Router>
  );
}

export default App;
