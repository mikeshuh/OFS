import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Redirect404 from "./pages/Redirect404.jsx";
import Cart from "./pages/Cart.jsx"
import Checkout from "./pages/Checkout.jsx"
import Orders from "./pages/Orders.jsx"
import OrderDetails from "./pages/OrderDetails.jsx"
import Signup from "./pages/Signup.jsx";
import Logout from "./pages/Logout.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx"
import Orders from "./pages/Orders.jsx"
import OrderDetails from "./pages/OrderDetails.jsx"
import AuthProvider from "./components/AuthContext.jsx";
import CartProvider from "./components/CartContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
<<<<<<< HEAD
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Navigate to="/products/all" replace />} />
            <Route path="/products/:category" element={<Products />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orderDetails" element={<OrderDetails />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Redirect404 />} />
          </Routes>
        </CartProvider>
=======
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productDetails" element={<ProductDetails />} />
        <Route path="/categories" element={<div>Food Category Page</div>} />
        
        {/*<Route element={<ProtectedRoute />}>*/}
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
        
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orderDetails" element={<OrderDetails />} />
        {/*</Route>*/}

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<div>Products</div>} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Redirect404 />} />
      </Routes>
>>>>>>> 99cad11dbc2c87e2fbe92bc54016ccd97d718cc6
      </AuthProvider>
    </Router>
  );
}

export default App;

/*
<Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
        
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orderDetails" element={<OrderDetails />} />
        </Route>
*/