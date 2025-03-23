import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import { requestServer } from "../utils/Utility";

const API_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch all products from the API
        const response = await requestServer(`${API_URL}/api/products`, "GET");

        if (response && response.data && response.data.success) {
          // Set products from the API response
          setProducts(response.data.data);

          // Extract unique categories from the API data
          const uniqueCategories = ['all', ...new Set(response.data.data.map(product => product.category))];
          setCategories(uniqueCategories);
        } else {
          throw new Error(response?.data?.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch products by category
  const fetchProductsByCategory = async (category) => {
    try {
      setLoading(true);

      if (category === 'all') {
        // Fetch all products
        const response = await requestServer(`${API_URL}/api/products`, "GET");

        if (response && response.data && response.data.success) {
          setProducts(response.data.data);
        } else {
          throw new Error(response?.data?.message || "Failed to fetch products");
        }
      } else {
        // Fetch products by category
        const response = await requestServer(`${API_URL}/api/products/category/${category}`, "GET");

        if (response && response.data && response.data.success) {
          setProducts(response.data.data);
        } else {
          throw new Error(response?.data?.message || "Failed to fetch products by category");
        }
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchProductsByCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Products</h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
              Error: {error}
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : (
            products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found in this category.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
