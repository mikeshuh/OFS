import React from 'react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, updateQuantity, cartItems } = useCart();
  const { loggedIn } = useAuth();

  if (!product) {
    return null;
  }

  // Destructure product properties
  const {
    productID,
    name,
    category,
    price,
    pounds,
    quantity,
    imagePath
  } = product;

  // Check if product is already in cart
  const productInCart = cartItems.find(item => item.productID === productID);
  const cartQuantity = productInCart ? productInCart.cartQuantity : 0;

  // Handle add to cart click
  const handleAddToCart = () => {
    if (!loggedIn) {
      alert("Please log in to add items to your cart");
      return;
    }

    addToCart(product);
  };

  // Handle quantity change
  const handleDecrease = () => {
    if (cartQuantity > 1) {
      updateQuantity(productID, cartQuantity - 1);
    } else {
      removeFromCart(productID);
    }
  };

  const handleIncrease = () => {
    if (cartQuantity < quantity) {
      updateQuantity(productID, cartQuantity + 1);
    }
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue > 0 && newValue <= quantity) {
      updateQuantity(productID, newValue);
    }
  };

  // Construct image URL from imagePath
  const imageUrl = imagePath ? `${API_URL}/static/${imagePath}` : null;

  return (
    <div className="bg-white rounded border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="bg-gray-50 rounded-lg p-2 mb-3">
        <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700 mb-2">
          {category}
        </span>
        <div className="h-40 w-full bg-gray-200 flex items-center justify-center mb-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover rounded"
            />
          ) : (
            <span className="text-gray-500 text-sm">{name}</span>
          )}
        </div>
        <p className="text-sm text-gray-500">{pounds} lbs</p>
      </div>

      <h3 className="font-medium text-gray-800 mb-1">{name}</h3>

      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-800">${parseFloat(price).toFixed(2)}</span>
        <span className="text-sm text-gray-500">{quantity > 10 ? 'In Stock' : (quantity > 0 ? `${quantity} Left in Stock` : 'Out of Stock')}</span>
      </div>

      {cartQuantity > 0 ? (
        // When item is in cart
        <div className="mt-3">
          <div className="flex items-center justify-between border rounded">
            <button
              onClick={handleDecrease}
              className="w-10 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-r"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={quantity}
              value={cartQuantity}
              onChange={handleInputChange}
              className="w-full h-9 text-center border-0 focus:outline-none focus:ring-0"
            />
            <button
              onClick={handleIncrease}
              className="w-10 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-l"
              disabled={cartQuantity >= quantity}
            >
              +
            </button>
          </div>
        </div>
      ) : (
        // Add to cart button when item is not in cart
        <button
          onClick={handleAddToCart}
          disabled={quantity <= 0}
          className={`w-full mt-3 py-2 rounded flex items-center justify-center ${
            quantity > 0
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
          </svg>
          Add to cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
