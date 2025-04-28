-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE OrderProduct;
TRUNCATE TABLE Product;
TRUNCATE TABLE `Order`;
TRUNCATE TABLE User;
TRUNCATE TABLE Payment;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert admin user
INSERT INTO User (isAdmin, firstName, lastName, email, hashedPassword)
VALUES (1, 'Admin', 'User', 'admin@example.com', '$2b$10$XEDM.mW4T0scJ5QWDF.TCeHIekfBTH9l3NatPGDj1/kR4S33.7Uf6');

-- Insert products
INSERT INTO Product (category, name, price, pounds, quantity, imagePath) VALUES
-- Fruits
('Fruit', 'Apples', 2.99, 3.00, 100, 'images/products/apples.jpg'),
('Fruit', 'Bananas', 1.49, 2.50, 150, 'images/products/bananas.jpg'),
('Fruit', 'Oranges', 3.49, 4.00, 120, 'images/products/oranges.jpg'),
('Fruit', 'Strawberries', 4.99, 1.00, 80, 'images/products/strawberries.jpg'),
('Fruit', 'Blueberries', 5.99, 0.50, 60, 'images/products/blueberries.jpg'),
('Fruit', 'Grapes', 3.99, 2.00, 90, 'images/products/grapes.jpg'),

-- Vegetables
('Vegetable', 'Carrots', 1.99, 2.00, 200, 'images/products/carrots.jpg'),
('Vegetable', 'Broccoli', 2.49, 1.00, 150, 'images/products/broccoli.jpg'),
('Vegetable', 'Spinach', 3.99, 0.50, 100, 'images/products/spinach.jpg'),
('Vegetable', 'Potatoes', 0.99, 5.00, 300, 'images/products/potatoes.jpg'),
('Vegetable', 'Onions', 1.29, 3.00, 250, 'images/products/onions.jpg'),
('Vegetable', 'Bell Peppers', 1.79, 1.50, 180, 'images/products/bell_peppers.jpg'),

-- Dairy
('Dairy', 'Milk', 3.49, 8.60, 120, 'images/products/milk.jpg'),
('Dairy', 'Eggs', 4.99, 1.50, 100, 'images/products/eggs.jpg'),
('Dairy', 'Cheese', 5.99, 2.00, 80, 'images/products/cheese.jpg'),
('Dairy', 'Yogurt', 1.99, 2.00, 150, 'images/products/yogurt.jpg'),
('Dairy', 'Butter', 3.99, 1.00, 90, 'images/products/butter.jpg'),

-- Meat
('Meat', 'Chicken Breast', 6.99, 3.00, 80, 'images/products/chicken_breast.jpg'),
('Meat', 'Ground Beef', 5.99, 1.00, 100, 'images/products/ground_beef.jpg'),
('Meat', 'Pork Chops', 7.99, 2.00, 70, 'images/products/pork_chops.jpg'),
('Meat', 'Salmon Fillet', 12.99, 1.00, 50, 'images/products/salmon_fillet.jpg'),
('Meat', 'Turkey', 8.99, 5.00, 60, 'images/products/turkey.jpg'),

-- Bakery
('Bakery', 'Bread', 2.99, 1.00, 100, 'images/products/bread.jpg'),
('Bakery', 'Bagels', 3.99, 1.00, 80, 'images/products/bagels.jpg'),
('Bakery', 'Muffins', 4.99, 0.75, 60, 'images/products/muffins.jpg'),
('Bakery', 'Croissants', 5.99, 0.50, 70, 'images/products/croissants.jpg'),
('Bakery', 'Cookies', 3.49, 0.50, 90, 'images/products/cookies.jpg'),

-- Pantry
('Pantry', 'Rice', 3.99, 5.00, 200, 'images/products/rice.jpg'),
('Pantry', 'Pasta', 1.99, 1.00, 180, 'images/products/pasta.jpg'),
('Pantry', 'Cereal', 4.49, 1.00, 120, 'images/products/cereal.jpg'),
('Pantry', 'Canned Soup', 2.49, 0.75, 150, 'images/products/canned_soup.jpg'),
('Pantry', 'Flour', 2.99, 5.00, 100, 'images/products/flour.jpg');
