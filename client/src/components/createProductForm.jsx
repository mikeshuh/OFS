import React, { useState, useEffect, useCallback } from "react";
import { Form } from 'react-bootstrap';
import { requestServer } from '../utils/Utility';


const API_URL = import.meta.env.VITE_API_URL;

const CreateProductForm = ({ }) => {
  //Used for creating product
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [pounds, setPounds] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState('');
  //used to reset file input component
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const selectableCategories = ["Fruit", "Vegetable", "Dairy", "Meat", "Bakery", "Pantry"];


  const handleSubmit = async (event) => {

    event.preventDefault();
    if (!name || !price || !quantity || !category || !pounds || !image) {
      setUploadError("Please fill in all fields and select an image.");
      return;
    }
    setUploading(true);
    setUploadError(null);


    try {

      const productForm = new FormData();

      productForm.append('name', name);
      productForm.append('category', category);
      productForm.append('price', price);
      productForm.append('pounds', pounds);
      productForm.append('quantity', quantity);
      productForm.append('image', image, image.name);


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
        setImage(null);
        setImagePreviewUrl(null);

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
            id="name"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#304c57] text-sm font-medium opacity-80">Price</label>
          <input
            type="number"
            id="price"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#304c57] text-sm font-medium opacity-80">Quantity</label>
          <input
            type="number"
            id="quantity"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#304c57] text-sm font-medium opacity-80">Pounds</label>
          <input
            type="number"
            id="pounds"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
            value={pounds}
            onChange={(e) => setPounds(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#304c57] text-sm font-medium opacity-80">Category</label>
          <Form.Select
            id="category"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#304c57]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {selectableCategories.map((cat, catID) => (
              <option key={catID} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[#304c57] text-sm font-medium opacity-80">Image</label>
          <input
            type="file"
            id="image"
            className="w-full text-sm focus:outline-none"
            onChange={handleImageChange}
          />
          {imagePreviewUrl && (
            <div className="mt-2">
              <span className="text-gray-600 text-xs">Selected file: {image.name}</span>
            <img src={imagePreviewUrl} alt='input image' className='max-w-[500px] max-h-[500px] object-cover' />
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
