import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Redirect404 from "./pages/Redirect404.jsx";
import Signup from "./pages/Signup.jsx";
import Logout from "./pages/Logout.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import ShoppingCartPage from '.pages/ShoppingCartPage';
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<div>Food Category Page</div>} />
        <Route path="/cart" element={<ShoppingCartPage/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<div>Products</div>} />
        <Route path="/payment" element={<PaymentPage/>}/>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Redirect404 />} />
      </Routes>
    </Router>
  );
}

export default App;
