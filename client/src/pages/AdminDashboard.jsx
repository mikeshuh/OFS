import React, { useState, useEffect, forwardRef, Children } from "react";
import logo from "../assets/OFS_logo.png";
import notification from "../assets/notification.svg";
import user from "../assets/user.svg";
import { requestServer } from "../utils/Utility";
import ProductCardAdmin from "../components/ProductCardAdmin.jsx";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

const API_URL = import.meta.env.VITE_API_URL;
const CustomToggle = forwardRef(({ children, onClick }, ref) => (
  <button
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="text-[#304c57] font-medium opacity-80 flex items-center hover:opacity-100 transition-opacity focus:outline-none"
  >
    {children} <span className="ml-1">&#x25bc;</span>
  </button>
));

const CustomMenu = forwardRef(
  ({ children }, ref) => {
    const [value, setValue] = useState('');
    return (
      <div
        ref={ref}
        className={`absolute top-full left-0 mt-1 min-w-[200px] bg-white rounded-lg shadow-lg border border-opacity-20 border-[#304c57] py-2 z-[1000] `}
      >
        <div className="px-3 py-2">
          <input
            className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <ul className="list-none m-0 p-0 flex flex-col max-h-60 overflow-y-auto">
          {Children.toArray(children).filter(
            (child) => {
              console.log(child.props.children);
              const childLabel = child.props.children.props?.children || '';
              return !value || childLabel.toLowerCase().includes(value.toLowerCase());
            }
          )}
        </ul>
      </div>
    );
  },
);

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await requestServer(`${API_URL}/api/products`, "GET");
        if (response?.data?.success) {
          const productsData = response.data.data;
          setAllProducts(productsData);
          setTotalPage(Math.ceil(productsData.length / itemsPerPage) || 1);
          setPage(1);
          setProducts(productsData.slice(0, itemsPerPage));
          const uniqueCategories = [...new Set(productsData.map(product => product.category))];
          setCategories(['all', ...uniqueCategories]);
        } else {
          console.error("Error fetching products:", response?.data?.message);
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

  const setPage = (page) => {
    setCurrentPage(page);
    setProducts(allProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage));
  }

  useEffect(() => {
    const filteredCategoryProducts = selectedCategory === 'all'
      ? allProducts
      : allProducts.filter(product => product.category === selectedCategory);
    const filteredProducts = searchValue === ''
      ? filteredCategoryProducts
      : filteredCategoryProducts.filter(product => product.name.toLowerCase().includes(searchValue.toLowerCase()));

    setProducts(filteredProducts.slice(0, itemsPerPage));
    setTotalPage(Math.ceil(filteredProducts.length / itemsPerPage) || 1);
    setCurrentPage(1);
  }, [selectedCategory, searchValue, allProducts]);

  const handleCategoryChange = (category) => {
    setDropdownOpen(false);
    setSelectedCategory(category);
  };

  const renderDropdownItem = (cat, idx) => {
    return (
      <div key={idx} className="w-full">
        <Dropdown.Item
          as="button"
          eventKey={cat}
          className="w-full text-left py-2 px-4 hover:bg-[#f7fbfc] block border-b border-opacity-10 border-black last:border-b-0"
          onClick={() => handleCategoryChange(cat)}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </Dropdown.Item>
      </div>
    );
  };

  return (
    <div>
      {/* Navbar */}
      <div className="w-full flex flex-row gap-8 items-center justify-between p-4 bg-white shadow-md fixed top-0 left-0 z-10">
        <div className="ms-1 flex flex-row gap-5 items-center">
          <img className="w-20 h-8" src={logo} alt="Logo" />
          <div className="rounded-lg px-2.5 py-1">
            <div className="text-[#304c57] text-base font-medium opacity-80">Home</div>
          </div>
          <div className="bg-[#f7fbfc] rounded-lg px-2.5 py-1">
            <div className="text-[#304c57] text-base font-semibold">Inventory</div>
          </div>
        </div>
        <div className="flex flex-row gap-2.5 items-center">
          <div className="bg-white rounded-lg border border-opacity-20 border-[#304c57] px-2.5 py-1 w-60 shadow-sm">
            <div className="text-[#304c57] text-base font-normal opacity-60">Quick action...</div>
          </div>
          <div className="rounded-lg border border-opacity-20 border-[#304c57] px-2.5 py-1 relative">
            <img className="w-6 h-6 opacity-80" src={notification} alt="Notifications" />
            <div className="bg-[#329141] rounded-full w-3 h-3 absolute left-6 top-2"></div>
          </div>
          <div className="rounded-lg border border-opacity-20 border-[#304c57] px-2.5 py-1 flex flex-row gap-2.5 items-center">
            <div className="text-[#304c57] text-base font-medium opacity-80">admin@example.com</div>
            <img className="w-6 h-6 opacity-80" src={user} alt="User" />
          </div>
        </div>
      </div>

      <div className="w-full mt-20 p-8 flex flex-col gap-5 items-start max-w-[1280px] ps-[50px] overflow-hidden">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-col gap-0 items-start">
            <div className="text-[#120213] text-2xl font-semibold">Product Information</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 items-start w-full">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row gap-2.5 items-center">
              <div className="relative z-50 bg-white rounded-lg border border-opacity-20 border-[#304c57] py-2.5 px-4 flex items-center shadow-sm w-[200px]">
                <span className="text-[#304c57] font-medium opacity-80 mr-2">Category:</span>
                <Dropdown
                  onSelect={handleCategoryChange}
                  show={dropdownOpen}
                  onToggle={(isOpen) => setDropdownOpen(isOpen)}
                >
                  <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  </Dropdown.Toggle>
                  {dropdownOpen ? (
                    <Dropdown.Menu as={CustomMenu}>
                      {categories.map((cat, idx) => renderDropdownItem(cat, idx))}
                    </Dropdown.Menu>)
                    : null
                  }
                </Dropdown>
              </div>
              <div className="z-40 bg-white rounded-lg border border-opacity-20 border-[#304c57] py-2.5 px-4 flex items-center shadow-sm">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="outline-none text-[#304c57] font-medium w-full"
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                />
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="flex flex-col items-start w-full">
            <div className="rounded-lg flex flex-col w-full border border-opacity-20 border-[#304c57]">
              <div className="bg-[#f7fbfc] rounded-t-lg py-4 flex flex-row">
                <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60 pl-5">Name</div>
                <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Category</div>
                <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Price</div>
                <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Pound</div>
                <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Quantity</div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading products...</p>
                </div>
              ) : (
                products.length > 0 ? (
                  products.map((product, idx) => (
                    <ProductCardAdmin key={idx} product={product} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No products found in this category.</p>
                  </div>
                )
              )}

              {/* Pagination */}
              <div className="rounded-b-lg py-2.5 px-5 flex flex-row items-center justify-between border-t border-opacity-20 border-[#304c57]">
                <div className="text-[#120213] text-sm font-medium opacity-80">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex flex-row gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setPage(page)}
                      className={`cursor-pointer ${currentPage === page ? "bg-white" : "bg-[#f7fbfc]"} rounded-full py-1 px-2.5`}
                    >
                      <div className={`text-[#120213] text-base font-medium ${currentPage === page ? "opacity-100" : "opacity-60"}`}>
                        {page}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
