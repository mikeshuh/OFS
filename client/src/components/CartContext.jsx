import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create the context
const CartContext = createContext(null);

<<<<<<< HEAD
// Cart storage key for localStorage
const CART_STORAGE_KEY = 'ofs_shopping_cart';

// Create the provider
const CartProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    try {
      // Try to get the cart from localStorage
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        // Parse and return the saved cart
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }

    // Return empty array if no saved cart or on error
    return [];
  });

=======
// Create the provider
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
>>>>>>> 99cad11dbc2c87e2fbe92bc54016ccd97d718cc6
  const auth = useAuth();

  // Register the clearCart function with the AuthContext
  useEffect(() => {
    if (auth && auth.registerCartFunctions) {
      auth.registerCartFunctions(clearCart);
    }
  }, [auth]);

<<<<<<< HEAD
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

=======
>>>>>>> 99cad11dbc2c87e2fbe92bc54016ccd97d718cc6
  // Add item to cart
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const exists = prevItems.find(item => item.productID === product.productID);

      if (exists) {
        // Increase quantity if item already in cart
        return prevItems.map(item =>
          item.productID === product.productID
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...product, cartQuantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productID) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.productID !== productID)
    );
  };

  // Update item quantity
  const updateQuantity = (productID, newQuantity) => {
    // Don't allow quantities less than 1
    if (newQuantity < 1) return;

    // Find the product in cart
    const product = cartItems.find(item => item.productID === productID);
    if (!product) {
      return;
    }

    // Don't allow quantities greater than available stock
    if (newQuantity > product.quantity) {
      newQuantity = product.quantity;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productID === productID
          ? { ...item, cartQuantity: newQuantity }
          : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
<<<<<<< HEAD
    // Also clear from localStorage
    localStorage.removeItem(CART_STORAGE_KEY);
=======
>>>>>>> 99cad11dbc2c87e2fbe92bc54016ccd97d718cc6
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.cartQuantity);
    }, 0);
  };

  // Calculate total items in cart
  const cartItemsCount = cartItems.reduce((total, item) => {
    return total + item.cartQuantity;
  }, 0);

  // Context value provided to consumers
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    cartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.error("useCart must be used within a CartProvider");
    // Provide a fallback to prevent app crashes
    return {
      cartItems: [],
      cartItemsCount: 0,
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      calculateTotal: () => 0
    };
  }
  return context;
};

export default CartProvider;
