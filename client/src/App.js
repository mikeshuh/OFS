import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products"
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";
import Redirect404 from "./pages/Redirect404";

import Signup from "./pages/Signup";
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<div>Products</div>} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Redirect404 />} />
      </Routes>
    </Router>
  );
}

export default App;
