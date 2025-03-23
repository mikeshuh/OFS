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
import TestPage from "./pages/TestPage.jsx";
import AuthProvider from "./components/AuthContext.jsx";
import CartProvider from "./components/CartContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/test" element={<TestPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<div>Shopping Cart Page</div>} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Redirect404 />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
