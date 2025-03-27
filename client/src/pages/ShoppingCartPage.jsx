import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ShoppingCartPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        const data = await res.json();
        setOrders(data.orders); // 根据你后端 /api/orders 的返回结构调整
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  //Need front-end update
  return (
    <div>
      <h2>My Shopping Cart</h2>
      {orders.length === 0 && <p>Your cart is empty.</p>}
      {orders.map(order => (
        <div key={order.orderID} style={{ marginBottom: '20px' }}>
          <p>Order #{order.orderID} - ${order.productsPrice}</p>
          <Link to={`/payment/${order.orderID}`}>
            <button>Checkout</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ShoppingCartPage;
