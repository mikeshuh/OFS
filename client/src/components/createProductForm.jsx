import React, { useState } from "react";
import { Form } from 'react-bootstrap';
import { requestServer } from '../utils/Utility';


const MAX_PRICE = 9999.99;
const MIN_PRICE_POUNDS = .01;
const MIN_QUANTITY = 1;
const MAX_POUNDS = 999.99;
const MAX_QUANTITY = 1000;

const REGEX_PRICE_POUNDS = /^\d+(\.\d{1,2})?$/;
const REGEX_QUANTITY = /^\d+$/;

const API_URL = import.meta.env.VITE_API_URL;

const CreateProductForm = ({selectableCategories, onProductAdded, products }) => {
  //Used for creating product
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [pounds, setPounds] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [fileInputKey, setFileInputKey] = useState(1);

  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const categories = ['New Category', ...selectableCategories];
  const [categoryOption, setCategoryOption] = useState(false);



  const handleSubmit = async (event) => {

    event.preventDefault();
    if (!name || !price || !quantity || !category || !pounds || !image) {
      setUploadError("Please fill in all fields and select an image.");
      return;
    }


    if (products.some(product => product.name.toLowerCase() === name.toLowerCase())) {
      setUploadError("Product already exists");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {

      const productForm = new FormData();

      const productData = [
        ['name', name],
        ['category', category],
        ['price', price],
        ['pounds', pounds],
        ['quantity', quantity],
        ['image', image],
       ]
      productData.map(([name,item]) => {
        productForm.append(name,item)
      })







      const token = localStorage.getItem("authToken");

      const response = await requestServer(`${API_URL}/api/products/create-product`,
        'POST',
        token,
        productForm,
        'multipart/form-data'
      );

      if (response?.data?.success) {
        console.log("Product added successfully:", response.data.data);
        // Reset the form
        setName('');
        setPrice('');
        setQuantity('');
        setCategory('');
        setCategoryOption('');
        setImage(null);
        setPounds('');
        setImagePreviewUrl(null);
        setFileInputKey(fileInputKey+1);

        onProductAdded(response.data.data);
      } else {
        console.error("Error adding product:", response?.data?.message);
        setUploadError(`Error adding product: ${response?.data?.message}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setUploadError(`Failed to add product: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreviewUrl(reader.result);
      };
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleCategoryChange = (e) => {
    const value  = e.target.value;

    if(value === 'New Category'){
      setCategoryOption('New Category');
      setCategory('');
    } else {
      setCategoryOption(value);
      setCategory(value);
    }

  }


  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    if (name === 'price' || name === 'pounds') {
      if (REGEX_PRICE_POUNDS.test(value)) {
        if(name === 'price')
          setPrice(value);
        else
          setPounds(value);
      }
    }

    if(name ==='quantity') {
      if(REGEX_QUANTITY.test(value)) {
        setQuantity(value);
      }
    }
  }

  return (
    <div className="rounded-lg flex flex-col w-full border border-opacity-20 border-[#304c57] bg-white shadow-sm">
      <div className="bg-[#f7fbfc] border-b border-black rounded-t-lg py-4 px-5">
        <div className="text-[#304c57] text-lg font-semibold">Add New Product</div>
      </div>
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        {uploadError && <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded">{uploadError}</div>}
        <div className="flex flex-col gap-1">
          <label className="text-[#304c57] text-sm font-medium opacity-80">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#304c57] text-sm font-medium opacity-80">Category</label>
          <Form.Select
            name="category"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
            value={categoryOption}
            onChange={handleCategoryChange}
          >
            <option value="">Select a category</option>
            {categories.map((cat, catID) => (
              <option key={catID} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </div>
        {categoryOption === 'New Category' && (
          <div className="flex flex-col gap-1">
            <label className="text-[#304c57] text-sm font-medium opacity-80">New Category</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-[#304c57] text-sm font-medium opacity-80">Price</label>
          <input
            type="number"
            name="price"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
            value={price}
            max={MAX_PRICE}
            min={MIN_PRICE_POUNDS}
            step=".01"
            onChange={handleNumberChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#304c57] text-sm font-medium opacity-80">Pounds</label>
          <input
            type="number"
            name="pounds"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
            max={MAX_POUNDS}
            min={MIN_PRICE_POUNDS}
            step=".01"
            value={pounds}
            onChange={handleNumberChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#304c57] text-sm font-medium opacity-80">Quantity</label>
          <input
            type="number"
            name="quantity"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
            value={quantity}
            max={MAX_QUANTITY}
            min={MIN_QUANTITY}
            onChange={handleNumberChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#304c57] text-sm font-medium opacity-80">Image</label>
          <input
            type="file"
            name="image"
            key={fileInputKey}
            className="w-full text-sm focus:outline-none"
            onChange={handleImageChange}
          />
          {imagePreviewUrl && (
            <div className="mt-2">
              <span className="text-gray-600 text-xs">Selected file: {image.name}</span>
            <img src={imagePreviewUrl} alt="input image" className="max-w-[500px] max-h-[500px] object-cover" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className={`bg-[#304c57] text-white font-medium rounded-lg py-2 px-4 hover:bg-[#233a42] focus:outline-none focus:ring-2 focus:ring-[#304c57] focus:ring-opacity-50 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
        >
          {uploading ? <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProductForm;
