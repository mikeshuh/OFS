import React from 'react';
import ProductCard from './ProductCard';

/**
 * ProductGrid component for displaying a grid of products from the database
 */
const ProductGrid = ({
  products = [],
  title = '',
  className = ''
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No products to display
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 relative inline-block">
            {title}
            <div className="absolute left-0 right-0 border-t border-gray-300 border-dashed top-1/2 -z-10"></div>
          </h2>
        </div>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
        {products.map(product => (
          <ProductCard
            key={product.productID}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
