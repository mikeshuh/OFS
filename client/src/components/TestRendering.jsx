import React from 'react';

const TestRendering = () => {
  console.log("TestRendering component is rendering");

  const testProducts = [
    {
      productID: 1,
      name: "Test Product 1",
      category: "Test",
      price: 9.99,
      pounds: 1.0,
      quantity: 5
    },
    {
      productID: 2,
      name: "Test Product 2",
      category: "Test",
      price: 19.99,
      pounds: 2.0,
      quantity: 10
    }
  ];

  return (
    <div className="mt-8 p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Test Rendering Component</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {testProducts.map(product => (
          <div key={product.productID} className="bg-white p-4 rounded-lg shadow">
            <div className="font-medium mb-2">{product.name}</div>
            <div className="text-sm text-gray-500">Category: {product.category}</div>
            <div className="text-sm text-gray-500">Weight: {product.pounds} lbs</div>
            <div className="mt-2 flex justify-between">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
            </div>
            <button className="mt-3 w-full bg-green-600 text-white py-2 rounded">
              Test Button
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestRendering;
