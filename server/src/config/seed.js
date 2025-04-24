// Seed script for OFS_DB
require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

// Configuration
const saltRounds = 10;
const defaultPassword = 'password123';

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'OFS_DB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Path prefix for product images (relative to server root)
const imagePathPrefix = 'images/products/';

// Sample data
const users = [
  { isAdmin: true, firstName: 'Admin', lastName: 'User', email: 'admin@example.com' }
];

const products = [
  // Fruits
  { category: 'Fruit', name: 'Apples', price: 2.99, pounds: 3.00, quantity: 100 },
  { category: 'Fruit', name: 'Bananas', price: 1.49, pounds: 2.50, quantity: 150 },
  { category: 'Fruit', name: 'Oranges', price: 3.49, pounds: 4.00, quantity: 120 },
  { category: 'Fruit', name: 'Strawberries', price: 4.99, pounds: 1.00, quantity: 80 },
  { category: 'Fruit', name: 'Blueberries', price: 5.99, pounds: 0.50, quantity: 60 },
  { category: 'Fruit', name: 'Grapes', price: 3.99, pounds: 2.00, quantity: 90 },

  // Vegetables
  { category: 'Vegetable', name: 'Carrots', price: 1.99, pounds: 2.00, quantity: 200 },
  { category: 'Vegetable', name: 'Broccoli', price: 2.49, pounds: 1.00, quantity: 150 },
  { category: 'Vegetable', name: 'Spinach', price: 3.99, pounds: 0.50, quantity: 100 },
  { category: 'Vegetable', name: 'Potatoes', price: 0.99, pounds: 5.00, quantity: 300 },
  { category: 'Vegetable', name: 'Onions', price: 1.29, pounds: 3.00, quantity: 250 },
  { category: 'Vegetable', name: 'Bell Peppers', price: 1.79, pounds: 1.50, quantity: 180 },

  // Dairy
  { category: 'Dairy', name: 'Milk', price: 3.49, pounds: 8.60, quantity: 120 },
  { category: 'Dairy', name: 'Eggs', price: 4.99, pounds: 1.50, quantity: 100 },
  { category: 'Dairy', name: 'Cheese', price: 5.99, pounds: 2.00, quantity: 80 },
  { category: 'Dairy', name: 'Yogurt', price: 1.99, pounds: 2.00, quantity: 150 },
  { category: 'Dairy', name: 'Butter', price: 3.99, pounds: 1.00, quantity: 90 },

  // Meat
  { category: 'Meat', name: 'Chicken Breast', price: 6.99, pounds: 3.00, quantity: 80 },
  { category: 'Meat', name: 'Ground Beef', price: 5.99, pounds: 1.00, quantity: 100 },
  { category: 'Meat', name: 'Pork Chops', price: 7.99, pounds: 2.00, quantity: 70 },
  { category: 'Meat', name: 'Salmon Fillet', price: 12.99, pounds: 1.00, quantity: 50 },
  { category: 'Meat', name: 'Turkey', price: 8.99, pounds: 5.00, quantity: 60 },

  // Bakery
  { category: 'Bakery', name: 'Bread', price: 2.99, pounds: 1.00, quantity: 100 },
  { category: 'Bakery', name: 'Bagels', price: 3.99, pounds: 1.00, quantity: 80 },
  { category: 'Bakery', name: 'Muffins', price: 4.99, pounds: 0.75, quantity: 60 },
  { category: 'Bakery', name: 'Croissants', price: 5.99, pounds: 0.50, quantity: 70 },
  { category: 'Bakery', name: 'Cookies', price: 3.49, pounds: 0.50, quantity: 90 },

  // Pantry
  { category: 'Pantry', name: 'Rice', price: 3.99, pounds: 5.00, quantity: 200 },
  { category: 'Pantry', name: 'Pasta', price: 1.99, pounds: 1.00, quantity: 180 },
  { category: 'Pantry', name: 'Cereal', price: 4.49, pounds: 1.00, quantity: 120 },
  { category: 'Pantry', name: 'Canned Soup', price: 2.49, pounds: 0.75, quantity: 150 },
  { category: 'Pantry', name: 'Flour', price: 2.99, pounds: 5.00, quantity: 100 }
];

const orders = [
];

const orderProducts = [
];

async function seed() {
  let connection;

  try {
    console.log('Starting database seeding...');

    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('TRUNCATE TABLE OrderProduct');
    await connection.execute('TRUNCATE TABLE Product');
    await connection.execute('TRUNCATE TABLE `Order`');
    await connection.execute('TRUNCATE TABLE User');
    await connection.execute('TRUNCATE TABLE Payment');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    // Generate hashed passwords and insert users
    console.log('Seeding users with proper bcrypt hashes...');
    const userIds = [];
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
      const [result] = await connection.execute(
        'INSERT INTO User (isAdmin, firstName, lastName, email, hashedPassword) VALUES (?, ?, ?, ?, ?)',
        [user.isAdmin, user.firstName, user.lastName, user.email, hashedPassword]
      );
      userIds.push(result.insertId);
    }
    console.log(`Inserted ${userIds.length} users`);

    // Insert products
    console.log('Seeding products...');
    const productIds = [];
    for (const product of products) {
      // Generate a simple lowercase filename, e.g., "apples.jpg"
      const imageFileName = `${product.name.toLowerCase().replace(/\s+/g, '_')}.jpg`;
      const imagePath = `${imagePathPrefix}${imageFileName}`;

      const [result] = await connection.execute(
        'INSERT INTO Product (category, name, price, pounds, quantity, imagePath) VALUES (?, ?, ?, ?, ?, ?)',
        [product.category, product.name, product.price, product.pounds, product.quantity, imagePath]
      );
      productIds.push(result.insertId);
    }
    console.log(`Inserted ${productIds.length} products`);

    // Insert orders
    console.log('Seeding orders...');
    const orderIds = [];
    for (const order of orders) {
      const userId = userIds[order.userIndex];
      const [result] = await connection.execute(
        'INSERT INTO `Order` (userID, totalPrice, totalPounds, deliveryFee, orderStatus, streetAddress, city, zipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, order.totalPrice, order.totalPounds, order.deliveryFee, order.orderStatus, order.streetAddress, order.city, order.zipCode]
      );
      orderIds.push(result.insertId);
    }
    console.log(`Inserted ${orderIds.length} orders`);

    // Insert order products
    console.log('Seeding order products...');
    let totalOrderProducts = 0;
    for (const orderProduct of orderProducts) {
      const orderId = orderIds[orderProduct.orderIndex];
      for (let i = 0; i < orderProduct.productIndices.length; i++) {
        const productId = productIds[orderProduct.productIndices[i]];
        const quantity = orderProduct.quantities[i];
        await connection.execute(
          'INSERT INTO OrderProduct (orderID, productID, quantity) VALUES (?, ?, ?)',
          [orderId, productId, quantity]
        );
        totalOrderProducts++;
      }
    }
    console.log(`Inserted ${totalOrderProducts} order products`);

    console.log('Database seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the seed function
seed();
