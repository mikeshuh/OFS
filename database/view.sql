CREATE VIEW User_view AS
SELECT userID, isAdmin, firstName, lastName, email, hashedPassword 
FROM User;

CREATE VIEW Order_view AS
SELECT orderID, userID, totalPrice, totalPounds, deliveryFee, orderTime, orderStatus, streetAddress, city, zipCode 
FROM Order;

CREATE VIEW Product_view AS
SELECT productID, category, name, price, pounds, quantity 
FROM Product;

CREATE VIEW OrderProduct_view AS
SELECT orderProductID, orderID, productID, quantity 
FROM OrderProduct;
