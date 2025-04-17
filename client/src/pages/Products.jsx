import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import { requestServer } from "../utils/Utility";

const API_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Grab current search term from URL
  const searchTerm = new URLSearchParams(location.search)
    .get("search")
    ?.toLowerCase() || "";

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);      // after category filter
  const [categories, setCategories] = useState(["all"]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Fetch all products once on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await requestServer(`${API_URL}/api/products`, "GET");

        if (response?.data?.success) {
          const productsData = response.data.data;
          setAllProducts(productsData);

          // Extract unique categories
          /*
          const uniqueCategories = ['all', ...new Set(productsData.map(product =>
            product.category.toLowerCase()
          ))];
          */
          const uniqueCategories = ['all', 'fruit', 'vegetable', 'dairy', 'meat', 'bakery', 'pantry'];
          setCategories(uniqueCategories);

          // Initialize with the URL category if valid, or 'all' otherwise
          const urlCategory = category?.toLowerCase() || 'all';
          const validCategory = uniqueCategories.includes(urlCategory) ? urlCategory : 'all';

          if (validCategory !== urlCategory) {
            navigate('/products/all');
          }

          setSelectedCategory(validCategory);
          filterProducts(productsData, validCategory);
        } else {
          throw new Error(response?.data?.message || "Failed to fetch products");
        }
        const data = res.data.data;
        setAllProducts(data);

        // build category list
        const cats = [
          "all",
          ...new Set(data.map((p) => p.category.toLowerCase()))
        ];
        setCategories(cats);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // 2) Re-filter on allProducts or category update
  useEffect(() => {
    if (!allProducts.length) return;

    const urlCat = (category || "all").toLowerCase();
    if (!categories.includes(urlCat)) {
      navigate("/products/all");
      return;
    }

    setSelectedCategory(urlCat);
    setProducts(
      urlCat === "all"
        ? allProducts
        : allProducts.filter((p) => p.category.toLowerCase() === urlCat)
    );
  }, [allProducts, category, categories, navigate]);

  // Final filtering by searchTerm
  const finalProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {selectedCategory === "all"
            ? "Our Products"
            : `${selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1)} Products`}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            Error: {error}
          </div>
        )}

        {/* Category Buttons (preserve searchTerm) */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                navigate(
                  `/products/${cat}${
                    searchTerm
                      ? `?search=${encodeURIComponent(searchTerm)}`
                      : ""
                  }`
                )
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {cat === "all"
                ? "All"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Product Grid or Messages */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : finalProducts.length > 0 ? (
          <ProductGrid products={finalProducts} />
        ) : searchTerm ? (
          <div className="text-center py-12 text-gray-600">
            No products match “<strong>{searchTerm}</strong>”.
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
