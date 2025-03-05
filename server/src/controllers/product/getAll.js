const products = [
  {
    id: 1,
    name: 'Apple iPhone 13',
    price: 799.99,
    category: 'Smartphones',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S21',
    price: 749.99,
    category: 'Smartphones',
  },
  {
    id: 3,
    name: 'Sony WH-1000XM4 Headphones',
    price: 348.00,
    category: 'Audio',
  },
  {
    id: 4,
    name: 'Apple MacBook Air M1',
    price: 999.00,
    category: 'Laptops',
  },
  {
    id: 5,
    name: 'Nike Air Max 270',
    price: 150.00,
    category: 'Footwear',
  },
  {
    id: 6,
    name: 'Sony PlayStation 5',
    price: 499.99,
    category: 'Gaming Consoles',
  },
  {
    id: 7,
    name: 'Canon EOS Rebel T7 Camera',
    price: 549.99,
    category: 'Cameras',
  },
  {
    id: 8,
    name: 'Fitbit Charge 5',
    price: 179.95,
    category: 'Fitness',
  },
  {
    id: 9,
    name: 'Samsung 50-inch 4K TV',
    price: 399.99,
    category: 'Electronics',
  },
  {
    id: 10,
    name: 'KitchenAid Stand Mixer',
    price: 379.99,
    category: 'Appliances',
  },
];

export const getAll = (req, res) => {

  res.send(JSON.stringify(products));
};
