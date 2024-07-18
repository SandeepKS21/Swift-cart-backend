const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const BASE_URL = process.env.BASE_URL;

const createCustomer = async (user) => {
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.firstName,
  });

  return customer.id;
};

const createPaymentLink = async (totalAmount, user, customerId, checkoutBody) => {
  const productDescription = 'Product purchase';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    invoice_creation: {
      enabled: true,
    },
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Purchased product from swift cart',
            description: productDescription,
          },
          unit_amount: totalAmount * 100, // Price in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${BASE_URL}/users/checkout/payment-success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${BASE_URL}/users/checkout/payment-cancel`,
    client_reference_id: user.id,
    customer: customerId,
    metadata: {
      user: checkoutBody.user,
      totalAmount: totalAmount,
      address: checkoutBody.address,
      deliveryDate: checkoutBody.date,
      time: checkoutBody.time,
    },
  });

  paymentRes = {
    url: session.url,
    sessionId: session.id,
  };

  return paymentRes;
};

const paymentSuccess = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
};

module.exports = { createPaymentLink, paymentSuccess, createCustomer };
