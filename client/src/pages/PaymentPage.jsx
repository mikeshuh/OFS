import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Group Account Stripe publishable key
const stripePromise = loadStripe('pk_test_51R1vfbELgvbL5w7R3rYY5gtzXobYVpQveGR4VQ1xjZHo5YfZDhmIzKhMKIfVw0S0GyLtriYyklMTPZKBpDvdzXrR00swQHNwJ8');

const CheckoutForm = ({ clientSecret, orderID }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      setMessage(`Payment failed: ${result.error.message}`);
    } else if (result.paymentIntent.status === 'succeeded') {
      setMessage('Payment succeeded!');
    }
  };

  return (
    <div>
      <h2>Payment for Order #{orderID}</h2>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>Pay Now</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

const PaymentPage = () => {
  const { orderID } = useParams();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const fetchPaymentIntent = async () => {
      const res = await fetch('http://localhost:5000/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderID }),
      });

      const data = await res.json();
      setClientSecret(data.data.clientSecret);
    };

    fetchPaymentIntent();
  }, [orderID]);

  return (
    <div>
      {clientSecret ? (
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} orderID={orderID} />
        </Elements>
      ) : (
        <p>Loading payment...</p>
      )}
    </div>
  );
};

export default PaymentPage;
