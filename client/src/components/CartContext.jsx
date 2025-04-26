import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { requestServer } from '../utils/Utility';
// Create the context
const CartContext = createContext(null);

// Cart storage key for localStorage
const CART_STORAGE_KEY = 'ofs_shopping_cart';
const TAX_RATE = 0.09375; // 9.375% tax rate
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

  const auth = useAuth();

  // Register the clearCart function with the AuthContext
  useEffect(() => {
    if (auth && auth.registerCartFunctions) {
      auth.registerCartFunctions(clearCart);
    }
  }, [auth]);

  const fetchProducts = async () => {
    const products = (await requestServer("/api/products", "GET")).data.data;
    let removedItems = [];
    let updatedPoundItems = [];
    let updatedPriceItems = [];
    cartItems.forEach(item => {
      const product = products.find(product => product.productID === item.productID);
      if (product && !product.active) {
        removeFromCart(item.productID);
        removedItems.push(`${item.name} `);
      } else if (product && (product.pounds !== item.pounds || product.price !== item.price)) {

        if (product.pounds!=item.pounds) {
          updatedPoundItems.push(`${item.name}`);
        }
        if (product.price!=item.price) {
          updatedPriceItems.push(`${item.name}`);
        }
        updateProductInfo(item, product);
      }
    })
    if (removedItems.length !== 0 ) {
      window.alert(`The following items have been removed from your cart: ${removedItems.join(",")}`);
    }
    if (updatedPoundItems.length !== 0) {
      window.alert(`The weight for the following product has changed: ${updatedPoundItems.join(",")}`);
    }
    if (updatedPriceItems.length !== 0) {
      window.alert(`The price for the following product has changed: ${updatedPriceItems.join(",")}`);
    }

  }
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

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

  // Update product information
  const updateProductInfo = (product, newProductInfo) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productID === product.productID
          ? { ...item, ...newProductInfo }
          : item
      )
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
    // Also clear from localStorage
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.cartQuantity);
    }, 0);
  };

  const calculateTotalWeight = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.pounds) * item.cartQuantity);
    }, 0);
  };

  const calculateTotalWithShipping = () => {
    const total = calculateTotal();
    const shippingCost = calculateTotalWeight() >= 20 ? 10 : 0;
    return total + shippingCost;
  }

  const calculateTotalWithTax = () => {
    const total = calculateTotalWithShipping();
    return total * (1 + TAX_RATE);
  }

  const getTaxRate = () => {
    return TAX_RATE;
  }

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
    updateProductInfo,
    fetchProducts,
    clearCart,
    calculateTotal,
    calculateTotalWeight,
    calculateTotalWithShipping,
    calculateTotalWithTax,
    getTaxRate,
    cartItemsCount,
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
      addToCart: () => { },
      removeFromCart: () => { },
      updateProductInfo: () => { },
      updateQuantity: () => { },
      fetchProducts: () => { },
      clearCart: () => { },
      calculateTotal: () => 0,
      calculateTotalWeight: () => 0,
      calculateTotalWithShipping: () => 0,
      calculateTotalWithTax: () => 0,
      getTaxRate: () => 0.09375,
    };
  }
  return context;
};

export default CartProvider;
