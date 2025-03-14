-- Create the database
CREATE DATABASE IF NOT EXISTS OFS_DB;
USE OFS_DB;

-- Create the User table
CREATE TABLE User (
    userID INT PRIMARY KEY AUTO_INCREMENT,
    isAdmin BOOL NOT NULL,
    firstName VARCHAR(32) NOT NULL,
    lastName VARCHAR(32) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    hashedPassword VARCHAR(64) NOT NULL,
    tokenVersion INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Create the Order table
CREATE TABLE `Order` (
    orderID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT NOT NULL,
    totalPrice DECIMAL(10,2) NOT NULL,
    totalPounds DECIMAL(10,2) NOT NULL,
    deliveryFee BOOL NOT NULL,
    orderTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    orderStatus BOOL NOT NULL,
    streetAddress VARCHAR(64) NOT NULL,
    city VARCHAR(32) NOT NULL,
    zipCode INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create the Product table
CREATE TABLE Product (
    productID INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(16) NOT NULL,
    name VARCHAR(32) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    pounds DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL
) ENGINE=InnoDB;

-- Create the OrderProduct table (Many-to-Many Relationship)
CREATE TABLE OrderProduct (
    orderProductID INT PRIMARY KEY AUTO_INCREMENT,
    orderID INT NOT NULL,
    productID INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES Product(productID) ON DELETE CASCADE
) ENGINE=InnoDB;
