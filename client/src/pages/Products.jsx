import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import { requestServer } from "../utils/Utility";

const API_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  const { category } = useParams(); // Get category from URL parameter
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch all products from the API
        const response = await requestServer(`${API_URL}/api/products`, "GET");

        if (response && response.data && response.data.success) {
          // Set products from the API response if no category is selected
          if (!category || category === 'all') {
            setProducts(response.data.data);
          }

          // Extract unique categories from the API data and ensure they're lowercase for URL
          const uniqueCategories = ['all', ...new Set(response.data.data.map(product =>
            product.category.toLowerCase() // Ensure categories are lowercase
          ))];
          setCategories(uniqueCategories);

          // If category is specified in URL but not valid, reset to 'all'
          if (category && category !== 'all' && !uniqueCategories.includes(category.toLowerCase())) {
            navigate('/products/all');
            setSelectedCategory('all');
          } else if (category && category !== 'all') {
            // If valid category is in URL, fetch those products
            fetchProductsByCategory(category);
          }
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
  }, [category]);

  // Fetch products by category
  const fetchProductsByCategory = async (categoryName) => {
    try {
      setLoading(true);

      if (categoryName === 'all') {
        // Fetch all products
        const response = await requestServer(`${API_URL}/api/products`, "GET");

        if (response && response.data && response.data.success) {
          setProducts(response.data.data);
        } else {
          throw new Error(response?.data?.message || "Failed to fetch products");
        }
      } else {
        const response = await requestServer(`${API_URL}/api/products/category/${categoryName}`, "GET");

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
  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    // Update URL when category changes - ensure lowercase for URL
    navigate(`/products/${categoryName.toLowerCase()}`);
  };

  // Get display name of category (for UI display purposes)
  const getCategoryDisplayName = (categoryName) => {
    if (categoryName === 'all') return 'All';

    // Find the original category name from the products for proper display
    const product = products.find(p => p.category.toLowerCase() === categoryName.toLowerCase());
    if (product) {
      return product.category; // Use the original casing from the data
    }

    // Fallback: capitalize first letter
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {selectedCategory === 'all'
              ? 'Our Products'
              : `${getCategoryDisplayName(selectedCategory)} Products`
            }
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
              Error: {error}
            </div>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => handleCategoryChange(cat)}
              >
                {getCategoryDisplayName(cat)}
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
