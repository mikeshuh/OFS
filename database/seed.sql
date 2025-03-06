INSERT INTO Product (productID, category, name, price, pounds, quantity)
VALUES (1, "fruit", "Apple", 0.89, 0.33, 200),
(2, "fruit", "Banana", 0.44, 0.26, 300),
(3, "fruit", "Orange", 0.99, 0.6, 200),
(4, "fruit", "Strawberry", 0.22, 0.06, 400),
(5, "vegetable", "Lettuce", 1.89, 0.66, 100),
(6, "vegetable", "Potato", 0.79, 0.47, 100),
(7, "vegetable", "Carrot", 0.99, 0.16, 100),
(8, "vegetable", "Onion", 0.84, 0.55, 100),
(9, "grain", "White Bread (Loaf)", 2.49, 1.00, 200),
(10, "grain", "White Rice (1 Cup)", 0.34, 0.43, 200);

INSERT INTO User (userID, isAdmin, firstName, lastName, email, hashedPassword)
VALUES (1, 1, "Danny", "Xu", "pocafup@gmail.com", "JEGI23jGEIU23jiweg23FJE"),
(2, 1, "Kevin", "Chan", "Endlessvoid@gmail.com", "EYg1328EGEGJbw238FEig"),
(11, 0, "Alice", "Anderson", "AIEADRO@gmail.com", "KDdF23psI4FJSqlJ485f"),
(12, 0, "Bob", "Brandon", "BobTheLocalCook@gmail.com", "a21sBbq0pQShjz7sEf89"),
(13, 0, "Charlie", "Copper", "CharliePersonal@gmail.com", "6etrFU7sx7hScWld4eiv"),
(14, 0, "Margaret", "Marcus", "MMWorkLife@gmail.com", "7Bqwuv43SAFSdjs23PTd");

INSERT INTO `Order` (orderID, userID, totalPrice, totalPounds, deliveryFee, orderTime, orderStatus, streetAddress, city, zipCode)
VALUES (1, 11, 10.68, 3.96, 0, '2025-03-01 12:54:39', 1, "550 East Taylor Street", "San Jose", 95112),
(2, 12, 27.25, 9.6, 1, '2025-03-01 13:41:17', 1, "2 East William Street", "San Jose", 95112);

INSERT INTO OrderProduct (orderProductID, orderID, productID, quantity)
VALUES (1, 1, 1, 12),
(2, 2, 5, 5),
(3, 2, 6, 10),
(4, 2, 7, 10);
