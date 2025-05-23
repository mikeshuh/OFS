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

  // Sort state
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // 1) Fetch all products once on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const res = await requestServer(`${API_URL}/api/products`, "GET");
        if (!res?.data?.success) {
          throw new Error(res?.data?.message || "Failed to fetch products");
        }
        // only keep active products
        const activeOnly = res.data.data.filter(p => p.active);
        setAllProducts(activeOnly);

        // build category list
        const cats = [
          "all",
          ...new Set(activeOnly.map((p) => p.category.toLowerCase()))
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

  // 3) Sort products if sortField is set
  const sortedProducts = sortField
    ? [...finalProducts].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      })
    : finalProducts;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
          {selectedCategory === "all"
            ? "Our Products"
            : `${selectedCategory} Products`}
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                selectedCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 mb-6">
          <label htmlFor="sortField" className="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sortField"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white focus:outline-none"
          >
            <option value="">None</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="price">Price</option>
            <option value="pounds">Weight</option>
          </select>
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="px-2 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none"
          >
            {sortOrder === "asc" ? "▲" : "▼"}
          </button>
        </div>

        {/* Product Grid or Messages */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <ProductGrid products={sortedProducts} />
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
