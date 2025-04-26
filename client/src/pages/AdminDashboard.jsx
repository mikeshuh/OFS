import React, { useState, useEffect, forwardRef, Children, useMemo, useCallback } from "react";
import logo from "../assets/OFS_logo.png";
import user from "../assets/user.svg";
import { requestServer } from "../utils/Utility";
import ProductCardAdmin from "../components/ProductCardAdmin.jsx";
import CreateProductForm from "../components/CreateProductForm.jsx";

import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

// Custom components extracted for reusability
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
        className="absolute top-full left-0 mt-1 min-w-[200px] bg-white rounded-lg shadow-lg border border-opacity-20 border-[#304c57] py-2 z-[1000]"
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
          {Children.toArray(children).filter(child => {
            const childLabel = child.props.children.props?.children || '';
            return !value || childLabel.toLowerCase().includes(value.toLowerCase());
          })}
        </ul>
      </div>
    );
  }
);

// Extracted reusable dropdown component
const FilterDropdown = ({ label, selectedValue, options, onSelect, capitalize = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  const displayValue = capitalize
    ? String(selectedValue).charAt(0).toUpperCase() + String(selectedValue).slice(1)
    : selectedValue;

  const handleSelect = useCallback((value) => {
    setIsOpen(false);
    onSelect(value);
  }, [onSelect]);

  return (
    <div className="relative z-50 bg-white rounded-lg border border-opacity-20 border-[#304c57] py-2.5 px-4 flex items-center shadow-sm">
      {label && <span className="text-[#304c57] font-medium opacity-80 mr-2">{label}</span>}
      <Dropdown show={isOpen} onToggle={(open) => setIsOpen(open)}>
        <Dropdown.Toggle as={CustomToggle} id={`dropdown-${label}`}>
          {displayValue}
        </Dropdown.Toggle>
        {isOpen && (
          <Dropdown.Menu as={CustomMenu}>
            {options.map((option, idx) => (
              <div key={idx} className="w-full">
                <Dropdown.Item
                  as="button"
                  eventKey={option}
                  className="w-full text-left py-2 px-4 hover:bg-[#f7fbfc] block border-b border-opacity-10 border-black last:border-b-0"
                  onClick={() => handleSelect(option)}
                >
                  {capitalize ? String(option).charAt(0).toUpperCase() + String(option).slice(1) : option}
                </Dropdown.Item>
              </div>
            ))}
          </Dropdown.Menu>
        )}
      </Dropdown>
    </div>
  );
};

// Extracted Navbar component
const Navbar = () => {
  const userProfile = JSON.parse(localStorage.getItem("userProfile")).email || "";
  return (
    <div className="w-full flex flex-row gap-8 items-center justify-between p-4 bg-white shadow-md fixed top-0 left-0 z-[1050]">
      <div className="ms-1 flex flex-row gap-5 items-center">
        <Link to="/" className="flex items-center">
          <img className="w-20 h-8" src={logo} alt="Logo" />
        </Link>
        <div className="rounded-lg px-2.5 py-1">
          <Link to="/" className="text-[#304c57] text-base font-medium opacity-80">Home</Link>
        </div>
        <div className="bg-[#f7fbfc] rounded-lg px-2.5 py-1">
          <div className="text-[#304c57] text-base font-semibold">Inventory</div>
        </div>
      </div>
      <div className="flex flex-row gap-2.5 items-center">
        <div className="rounded-lg border border-opacity-20 border-[#304c57] px-2.5 py-1 flex flex-row gap-2.5 items-center">
          <div className="text-[#304c57] text-base font-medium opacity-80">{userProfile}</div>
          <img className="w-6 h-6 opacity-80" src={user} alt="User" />
        </div>
      </div>
    </div>
  )
};

// Pagination component
const Pagination = ({ currentPage, totalPages, pages, setPage }) => (
  <div className="rounded-b-lg py-2.5 px-5 flex flex-row items-center justify-between">
    <div className="text-[#120213] text-sm font-medium opacity-80">
      Page {currentPage} of {totalPages}
    </div>
    <div className="flex flex-row gap-1">
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-2 text-[#120213] opacity-60"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => setPage(page)}
            className={`cursor-pointer ${currentPage === page ? "bg-white" : "bg-[#f7fbfc]"} rounded-full py-1 px-2.5`}
          >
            <div
              className={`text-[#120213] text-base font-medium ${currentPage === page ? "opacity-100" : "opacity-60"}`}
            >
              {page}
            </div>
          </button>
        )
      )}
    </div>
  </div>
);

// Custom hook for pagination logic
const usePagination = (items, itemsPerPage, dependencies = []) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState([]);
  const [paginatedItems, setPaginatedItems] = useState([]);

  // Calculate page numbers to show
  const updatePages = useCallback(() => {
    const pageSetter = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageSetter.push(i);
      }
    } else {
      if (currentPage !== 1) {
        pageSetter.push(1);
      }
      if (currentPage > 2) {
        pageSetter.push("...");
        pageSetter.push(currentPage - 1);
      }
      pageSetter.push(currentPage);
      if (currentPage < totalPages - 1) {
        pageSetter.push(currentPage + 1);
        pageSetter.push("...");
      }
      if (currentPage !== totalPages) {
        pageSetter.push(totalPages);
      }
    }
    setPages(pageSetter);
  }, [currentPage, totalPages]);

  // Update pagination when items or itemsPerPage changes
  useEffect(() => {
    setTotalPages(Math.ceil(items.length / itemsPerPage) || 1);
    setCurrentPage(1);
  }, [items.length, itemsPerPage, ...dependencies]);

  // Update pages display when currentPage or totalPages changes
  useEffect(() => {
    updatePages();
  }, [updatePages, totalPages, currentPage]);

  // Update paginated items when currentPage changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    setPaginatedItems(items.slice(startIndex, startIndex + itemsPerPage));
  }, [items, currentPage, itemsPerPage]);

  const setPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return {
    currentPage,
    totalPages,
    pages,
    paginatedItems,
    setPage
  };
};

// Main component
const AdminDashboard = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['all']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [Error, setError] = useState(null);
  const selectableCategories = categories.filter(category => category !== 'all');
  const [selectedStatus, setSelectedStatus] = useState('all');


  // sort state
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const itemsPerPageList = [5, 10, 20, 50];

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    // First filter by category
    const categoryFiltered = selectedCategory === 'all'
      ? allProducts
      : allProducts.filter(product => product.category === selectedCategory);

    // Then filter by search term
    const bySearch = searchValue === ''
      ? categoryFiltered
      : categoryFiltered.filter(product =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      );

      if (selectedStatus === 'active') {
        return bySearch.filter(product => product.active);
      }
      if (selectedStatus === 'inactive') {
        return bySearch.filter(product => !product.active);
      }
      return bySearch;
  }, [allProducts, selectedCategory, searchValue, selectedStatus]);

  // sort the filtered products
  const sortedProducts = useMemo(() => {
    if (!sortField) return filteredProducts;
    return [...filteredProducts].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortField, sortOrder]);

  // Get pagination data using custom hook
  const { currentPage, totalPages, pages, paginatedItems: products, setPage } =
    usePagination(sortedProducts, itemsPerPage, [selectedCategory, searchValue, sortField, sortOrder, selectedStatus]);

  // Fetch products on component mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await requestServer(`${API_URL}/api/products`, "GET");
        if (response?.data?.success) {
          const productsData = response.data.data;
          setAllProducts(productsData);
          setError(null);
          const uniqueCategories = [...new Set(productsData.map(p => p.category))];
          setCategories(['all', ...uniqueCategories]);
        } else {
          console.error("Error fetching products:", response?.data?.message);
          setError(`Error fetching products: ${response?.data?.message}`);
          throw new Error(response?.data?.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(`Error fetching products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Handle product updates
  const handleUpdateProduct = (updatedProduct) => {
    setAllProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.productID === updatedProduct.productID ? updatedProduct : p
      )
    );
  };

  const handleProductAdded = (newProduct) => {
    const category = newProduct.category
    const parsedPrice = parseFloat(newProduct.price).toFixed(2);
    const parsedPounds = parseFloat(newProduct.pounds).toFixed(2);
    if (category && !categories.includes(category)) {
      setCategories(prevCategories => [...prevCategories, category]);
    }
    setAllProducts((prevProducts) => [...prevProducts, {...newProduct, price: parsedPrice, pounds: parsedPounds}]);
  };



  return (
    <div>
      <Navbar />
      <div className="w-full mt-20 p-8 flex flex-col gap-5 items-start max-w-[1440px] ps-[50px] overflow-hidden">
        {Error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4 text-sm w-full">
            {Error}
          </div>
        )}
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-[#120213] text-2xl font-semibold">Product Information</div>
        </div>

        <div className="flex flex-col gap-2.5 items-start w-full">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row gap-2.5 items-center">
              <FilterDropdown
                label="Category:"
                selectedValue={selectedCategory}
                options={categories}
                onSelect={setSelectedCategory}
              />
              <FilterDropdown
                label="Status:"
                selectedValue={selectedStatus}
                options={['all','active','inactive']}
                onSelect={setSelectedStatus}
              />
              <div className="z-40 bg-white rounded-lg border border-opacity-20 border-[#304c57] py-2.5 px-4 flex items-center shadow-sm">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="outline-none text-[#304c57] font-medium w-full"
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                />
              </div>
              <FilterDropdown
                label="items per page:"
                selectedValue={itemsPerPage}
                options={itemsPerPageList}
                onSelect={setItemsPerPage}
                capitalize={false}
              />
              {/* ←— NEW: Sort Controls */}
              <FilterDropdown
                label="Sort by:"
                selectedValue={sortField || 'none'}
                options={['none','name','category','price','pounds','quantity']}
                onSelect={value => setSortField(value === 'none' ? '' : value)}
              />
              <div
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="bg-white rounded-lg border border-opacity-20 border-[#304c57] py-2.5 px-4 flex items-center shadow-sm cursor-pointer"
              >
                {sortOrder === 'asc' ? '▲' : '▼'}
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="rounded-lg flex flex-col w-full border border-opacity-20 border-[#304c57]">
            <div className="bg-[#f7fbfc] border-b border-black rounded-t-lg py-4 flex flex-row px-5">
              <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Name</div>
              <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Category</div>
              <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Price</div>
              <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Pounds</div>
              <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Quantity</div>
              <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Image</div>
              <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Active</div>
              <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Action</div>
              <div className="text-[#304c57] text-sm font-medium w-[15%] opacity-60">Status</div>
            </div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCardAdmin key={product.productID} product={product} onUpdate={handleUpdateProduct} />
              ))
            ) : (
              <div className="text-center py-12 border-b border-black">
                <p className="text-gray-600">No products match search criteria.</p>
              </div>
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pages={pages}
              setPage={setPage}
            />
          </div>

          <div className="flex flex-col items-start w-full">
          <CreateProductForm  selectableCategories={selectableCategories} onProductAdded={handleProductAdded} products={allProducts} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
