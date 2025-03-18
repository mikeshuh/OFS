-- Drop and recreate entire OFS_DB schema from scratch

-- Step 1: Drop the database if it exists
DROP DATABASE IF EXISTS OFS_DB;

-- Step 2: Create database
CREATE DATABASE OFS_DB;
USE OFS_DB;

-- Step 3: Create User table
CREATE TABLE User (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    isAdmin BOOL NOT NULL,
    firstName VARCHAR(32) NOT NULL,
    lastName VARCHAR(32) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    hashedPassword VARCHAR(64) NOT NULL,
    tokenVersion INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Step 4: Create Product table
CREATE TABLE Product (
    productID INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(16) NOT NULL,
    name VARCHAR(32) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    pounds DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL
) ENGINE=InnoDB;

-- Step 5: Create Order table
CREATE TABLE `Order` (
    orderID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    productsPrice DECIMAL(5,2) NOT NULL DEFAULT 0,
    deliveryFee DECIMAL(4,2) NOT NULL DEFAULT 0,
    totalPounds DECIMAL(6,2) NOT NULL,
    orderTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deliveryStatus BOOL NOT NULL,
    streetAddress VARCHAR(64) NOT NULL,
    city VARCHAR(32) NOT NULL,
    zipCode INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Step 6: Create OrderProduct table (Many-to-Many)
CREATE TABLE OrderProduct (
    orderProductID INT PRIMARY KEY AUTO_INCREMENT,
    orderID INT NOT NULL,
    productID INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES Product(productID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Step 7: Create Payment table
CREATE TABLE Payment (
  paymentID INT AUTO_INCREMENT PRIMARY KEY,
  orderID INT NOT NULL,
  userID INT NOT NULL,
  paymentIntentID VARCHAR(255) NOT NULL,
  totalPrice DECIMAL(10, 2) NOT NULL,
  paymentStatus ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (orderID) REFERENCES `Order`(orderID) ON DELETE CASCADE,
  FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Step 8: Insert test user
INSERT INTO User (isAdmin, firstName, lastName, email, hashedPassword)
VALUES (0, 'Test', 'User', 'test@example.com', 'hashedpassword');

-- Step 9: Insert test products
INSERT INTO Product (category, name, price, pounds, quantity) VALUES
('Fruit', 'Apple', 2.00, 1.00, 100),
('Vegetable', 'Carrot', 1.50, 1.00, 100);

-- Step 10: Insert test orders
INSERT INTO `Order` (userID, productsPrice, deliveryFee, totalPounds, streetAddress, city, zipCode, deliveryStatus)
VALUES
(1, 38.00, 0.00, 19.00, '123 Main St', 'San Jose', 95112, 0),
(1, 44.00, 10.00, 22.00, '123 Main St', 'San Jose', 95112, 0);

-- Step 11: Insert OrderProduct mappings
INSERT INTO OrderProduct (orderID, productID, quantity) VALUES
(1, 1, 19),
(2, 2, 22);

-- Step 12: Insert test payments
INSERT INTO Payment (orderID, userID, paymentIntentID, totalPrice, paymentStatus)
VALUES
(1, 1, 'pi_test_12345', 38.00, 'Pending'),
(2, 1, 'pi_test_67890', 54.00, 'Pending');
