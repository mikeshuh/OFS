import React, { useState, useEffect, forwardRef,useRef} from "react";
import logo from "../assets/OFS_logo.png";
import notification from "../assets/notification.svg";
import user from "../assets/user.svg";
import { requestServer } from "../utils/Utility";
import ProductCardAdmin from "../components/ProductCardAdmin.jsx";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';


const API_URL = import.meta.env.VITE_API_URL;
const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['all']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const toggleRef = useRef();
  const itemsPerPage = 10;

  const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="w-full text-left text-[#304c57] text-sm font-medium flex items-center justify-between"
    >
      {children}
      <span className="ml-2 text-gray-400">&#x25bc;</span> {/* Down arrow */}
    </button>
  ));
  const CustomMenu = forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');

      return (
        <div
          ref={ref}
          style={style}
          className={`bg-white border border-gray-200 rounded-md shadow-md p-2 ${className}`}
          aria-labelledby={labeledBy}
        >
          <input
            autoFocus
            type="text"
            className="w-full px-3 py-1 mb-2 text-sm text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-200"
            placeholder="Search..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <div className="flex flex-col">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </div>

        </div>
      );
    }
  );


  const [totalPages, setTotalPage] = useState(Math.ceil(allProducts.length / itemsPerPage));
  // Initial data load
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await requestServer(`${API_URL}/api/products`, "GET");

        if (response?.data?.success) {
          const productsData = response.data.data;
          console.log(response.data);
          setAllProducts(productsData);
          setTotalPage(Math.ceil(productsData.length / itemsPerPage));
          setPage(1);
          setProducts(productsData.slice(0, itemsPerPage));

          // Extract unique categories
          const uniqueCategories = ['all', ...new Set(productsData.map(product =>
            product.category.toLowerCase()
          ))];
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

    fetchAllProducts();
  }, []);

  const setPage = (page) => {
    console.log(page);
    setCurrentPage(page);
    setProducts(allProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage));
  }
  return (
    <div>
      {/* Navbar */}
      <div className="w-full flex flex-row gap-[30px] items-center justify-between p-4 bg-white shadow-md fixed top-0 left-0">
        <div className="ms-5px flex flex-row gap-5 items-center">
          <img className="w-[82px] h-[35.2px] " src={logo} />
          <div className="rounded-[10px] px-2.5 py-[5px]">
            <div className="text-[#304c57] font-['Roboto-Medium',_sans-serif] text-base font-medium opacity-80">Home</div>
          </div>
          <div className="bg-[#f7fbfc] rounded-[10px] px-2.5 py-[5px]">
            <div className="text-[#304c57] font-['Roboto-SemiBold',_sans-serif] text-base font-semibold">Inventory</div>
          </div>
          <div className="rounded-[10px] px-2.5 py-[5px]">
            <div className="text-[#304c57] font-['Roboto-Medium',_sans-serif] text-base font-medium opacity-80">Layers</div>
          </div>
        </div>
        <div className="flex flex-row gap-2.5 items-center">
          <div className="bg-white rounded-[10px] border border-[rgba(48,76,87,0.20)] px-2.5 py-[5px] w-60 shadow-md">
            <div className="text-[#304c57] font-['Roboto-Regular',_sans-serif] text-base font-normal opacity-60">Quick action...</div>
          </div>
          <div className="rounded-[10px] border border-[rgba(48,76,87,0.20)] px-2.5 py-[5px] relative">
            <img className="w-6 h-6 opacity-80" src={notification} />
            <div className="bg-[#329141] rounded-full w-[11px] h-[11px] absolute left-[25px] top-[7px]"></div>
          </div>
          <div className="rounded-[10px] border border-[rgba(48,76,87,0.20)] px-2.5 py-[5px] flex flex-row gap-2.5 items-center">
            <div className="text-[#304c57] font-['Roboto-Medium',_sans-serif] text-base font-medium opacity-80">admin@example.com</div>
            <img className="w-6 h-6 opacity-80" src={user} />
          </div>
        </div>
      </div>

      {/* Add margin to push content below navbar */}
      <div className="w-full mt-[80px] p-[30px] flex flex-col gap-5 items-end justify-start w-[1280px] ps-5px ">
        <div className="flex flex-row items-center justify-between self-stretch">
          <div className="flex flex-col gap-0 items-start w-[559.5px]">
            <div className="text-[#120213] font-['Roboto-SemiBold',_sans-serif] text-2xl font-semibold">Product Informations</div>
          </div>
        </div>




        <div className="flex flex-col gap-2.5 items-start justify-start self-stretch shrink-0 relative">
          <div className="flex flex-row items-end justify-between self-stretch shrink-0 relative">
            <div className="flex flex-row gap-2.5 items-start justify-start shrink-0 relative">
              <div className="z-50 bg-[#ffffff] rounded-[10px] border border-[rgba(48,76,87,0.20)] pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex items-center justify-start shrink-0 relative"
                style={{ boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.10)", minWidth: "180px" }}>
                <Dropdown>
                  <Dropdown.Toggle
                    ref= {toggleRef}
                    as={CustomToggle}
                    id="dropdown-custom-components"
                    className="text-[#304c57] text-sm font-medium text-left bg-transparent border-none "
                  >
                    {selectedCategory || "Select Category"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu as={CustomMenu}>
                    {categories.map((category, idx) => (
                      <Dropdown.Item
                        key={idx}
                        eventKey={category}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="bg-[#ffffff] rounded-[10px] border-solid border-[rgba(48,76,87,0.20)] border pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-row gap-2.5 items-center justify-start shrink-0 relative" style={{ boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.10)" }}>
                <input type="category" id="category" placeholder="Enter a category" />
              </div>
              <div className="bg-[#ffffff] rounded-[10px] border-solid border-[rgba(48,76,87,0.20)] border pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-row gap-2.5 items-center justify-start shrink-0 relative" style={{ boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.10)" }}>
                <input type="name" id="name" placeholder="Enter a product name" />
              </div>
              <div className="bg-[#ffffff] rounded-[10px] border-solid border-[rgba(48,76,87,0.20)] border pt-2.5 pr-[15px] pb-2.5 pl-[15px] flex flex-row gap-2.5 items-center justify-start shrink-0 relative" style={{ boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.10)" }}>
                <input type="sort" id="sort" placeholder="Sort by" />
              </div>
            </div>

          </div>

          <div className="flex flex-col items-start justify-start shrink-0 w-full relative">
            <div className="rounded-[10px] flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
              <div className="bg-[#f7fbfc] rounded-tl-[10px] rounded-tr-[10px] pt-[15px] pr-5 pb-[15px] pl-5 flex flex-row gap-10 items-center justify-start self-stretch shrink-0 relative">
                <div className="text-[#304c57] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative w-[110px]" style={{ opacity: "0.6" }}>Name</div>
                <div className="text-[#304c57] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative w-[110px]" style={{ opacity: "0.6" }}>Category</div>
                <div className="text-[#304c57] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative w-[110px]" style={{ opacity: "0.6" }}>Price</div>
                <div className="text-[#304c57] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative w-[110px]" style={{ opacity: "0.6" }}>Pound</div>
                <div className="text-[#304c57] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative w-[110px]" style={{ opacity: "0.6" }}>Quantity</div>
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

              <div className="rounded-br-[10px] rounded-bl-[10px] pt-2.5 pr-5 pb-2.5 pl-5 flex flex-row items-center justify-between self-stretch shrink-0 relative">
                <div className="text-[#120213] text-left font-['Roboto-Medium',_sans-serif] text-sm font-medium relative" style={{ opacity: "0.8" }}>
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex flex-row gap-[5px] items-center justify-start shrink-0 relative">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <div
                      key={page}
                      onClick={() => setPage(page)}
                      className={`cursor-pointer ${currentPage === page ? "bg-[#ffffff]" : "bg-[#f7fbfc]"} rounded-[70px] pt-[5px] pr-2.5 pb-[5px] pl-2.5 flex flex-row gap-2.5 items-center justify-end shrink-0 relative`}
                      style={{ opacity: currentPage === page ? "1" : "0.6" }}
                    >
                      <div className="text-[#120213] text-left font-['Roboto-Medium',_sans-serif] text-base font-medium relative">
                        {page}
                      </div>
                    </div>
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
