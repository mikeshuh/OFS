import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Redirect404 from "./pages/Redirect404.jsx";
import Signup from "./pages/Signup.jsx";
import Logout from "./pages/Logout.jsx";
import Cart from "./pages/Cart.jsx";
import AuthProvider from "./components/AuthContext.jsx";
import CartProvider from "./components/CartContext.jsx";
import GetProducts from "./components/GetProducts.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Map from "./pages/Map.jsx";
import CheckoutMap from "./pages/CheckoutMap.jsx";
import StripeCheckoutWrapper from "./pages/StripeCheckoutWrapper.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
        <GetProducts>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Navigate to="/products/all" replace />} />
            <Route path="/products/:category" element={<Products />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/map" element={<Map />} />
              <Route path="/checkout-map" element={<CheckoutMap />} />
              <Route path="/checkout" element={<StripeCheckoutWrapper />} />
              <Route path="/order-confirmation/:orderID" element={<OrderConfirmation />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Redirect404 />} />
          </Routes>
        </GetProducts>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
