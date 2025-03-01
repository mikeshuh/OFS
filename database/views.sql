CREATE VIEW User_view AS
SELECT userID, isAdmin, firstName, lastName, email, hashedPassword 
FROM User;

CREATE VIEW Order_view AS
SELECT orderID, userID, totalPrice, totalPounds, deliveryFee, orderTime, orderStatus, streetAddress, city, zipCode 
FROM `Order`;

CREATE VIEW Product_view AS
SELECT productID, category, name, price, pounds, quantity 
FROM Product;

-- Replaces product id with product name.
CREATE VIEW OrderProduct_view AS
SELECT OrderProduct.orderProductID, OrderProduct.orderID, Product.name, OrderProduct.quantity
FROM OrderProduct
INNER JOIN Product ON OrderProduct.productID=Product.productID;
