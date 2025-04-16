import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import { requestServer } from "../utils/Utility";

const API_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['all']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchProducts, setSearchProducts] = useState([])

  // Initial data load
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await requestServer(`${API_URL}/api/products`, "GET");

        if (response?.data?.success) {
          const productsData = response.data.data;
          setAllProducts(productsData);

          // Extract unique categories
          const uniqueCategories = ['all', ...new Set(productsData.map(product =>
            product.category.toLowerCase()
          ))];
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
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("searchTerm")) {
      const itemURL = JSON.parse(localStorage.getItem("itemData"));
      filterForSearch(allProducts);
    }
  }, [category, allProducts, categories, navigate]);

  // Update when URL category changes
  useEffect(() => {
    if (category != 'all') {
        const urlCategory = category.toLowerCase();
        if (categories.includes(urlCategory)) {
          setSelectedCategory(urlCategory);
          const source = localStorage.getItem("searchTerm") ? searchProducts : allProducts;
          filterProducts(source, urlCategory) 
        }
    } 
  }, [category, allProducts, categories, navigate]);


  const filterForSearch = (productsData) => {
    setProducts(
      productsData.filter(product => 
        (product.name.toLowerCase().includes(localStorage.getItem("searchTerm").toLowerCase()) || product.category.toLowerCase().includes(localStorage.getItem("searchTerm").toLowerCase()))
      )
    );
    setSearchProducts(
      productsData.filter(product => 
        (product.name.toLowerCase().includes(localStorage.getItem("searchTerm").toLowerCase()) || product.category.toLowerCase().includes(localStorage.getItem("searchTerm").toLowerCase()))
      )
    )
  };

  // Filter products based on selected category
  const filterProducts = (productsData, categoryName) => {
    if (categoryName === 'all') {
      setProducts(productsData);
    } else {
      setProducts(productsData.filter(
        product => product.category.toLowerCase() === categoryName
      ));
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    const source = searchProducts.length > 0 ? searchProducts : allProducts;
    filterProducts(source, categoryName)
    navigate(`/products/${categoryName}`);
  };

  // Get properly formatted category name for display
  const getCategoryDisplayName = (categoryName) => {
    if (categoryName === 'all') return 'All';

    const product = allProducts.find(p =>
      p.category.toLowerCase() === categoryName
    );

    return product ? product.category :
      categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
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
                  selectedCategory === cat
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
