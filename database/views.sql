-- Displays User's name instead of ID.
CREATE VIEW Order_view AS
SELECT Order.orderID, User.firstName, User.LastName, Order.totalPrice, Order.totalPounds, Order.deliveryFee, Order.orderTime, Order.orderStatus, Order.streetAddress, Order.city, Order.zipCode
FROM `Order`
INNER JOIN User ON Order.userID=User.userID;

-- Displays Product's ID instead of ID.
CREATE VIEW OrderProduct_view AS
SELECT OrderProduct.orderProductID, OrderProduct.orderID, Product.name, OrderProduct.quantity
FROM OrderProduct
INNER JOIN Product ON OrderProduct.productID=Product.productID;
