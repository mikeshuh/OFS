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

-- OrderProduct_view that also includes userID and ordertime.
CREATE VIEW OrderProduct_view2 AS
SELECT OrderProduct.orderProductID, Order.orderID, Order.UserID, Product.name, OrderProduct.quantity, Order.orderTime
FROM OrderProduct
INNER JOIN Product ON OrderProduct.productID=Product.productID
INNER JOIN `Order` ON OrderProduct.orderID=Order.orderID;
