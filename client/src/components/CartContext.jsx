import React, { createContext, useContext, useState } from 'react';

// Create the context
const CartContext = createContext(null);

// Create the provider
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const exists = prevItems.find(item => item.productID === product.productID);

      if (exists) {
        return prevItems.map(item =>
          item.productID === product.productID
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, cartQuantity: 1 }];
      }
    });
  };

  // Calculate total items in cart
  const cartItemsCount = cartItems.reduce((total, item) => {
    return total + item.cartQuantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, cartItemsCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart context
export const useCart = () => useContext(CartContext);

export default CartProvider;
