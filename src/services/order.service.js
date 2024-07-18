const httpStatus = require('http-status');
const { CartModel, Product } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const Order = require('../models/Order.model');
const { cartService, userService } = require('.');
const Transaction = require('../models/Transaction.model');

const createOrder = async (orderBody) => {
  // check if order exists

  //   const invoice = 'in_1OzGulDwwlfx8vZDf00FYT1i';
  //   const paymentIntent = 'pi_3OzGukDwwlfx8vZD0VnsEFJk';
  //   const paymentStatus = 'paid';
  //   const metadata = {
  //     address: '6600553e46a2693f240cdf32',
  //     deliveryDate: '38 Mar 2024',
  //     time: '10:: am',
  //     user: '65f5a40fcb3ba63d60285d5a',
  //     totalAmount: 58489,
  //   };

  //   const orderBody = {
  //     invoice,
  //     metadata,
  //     paymentIntent,
  //     paymentStatus,
  //   };

  const cart = await cartService.findCart({ user: orderBody.metadata.user });

  const purchasedItem = cart.map((product) => {
    return {
      product: product.product.id,
      quantity: product.quantity,
      priceAtPurchase: product.product.discountPrice,
      totalPrice: product.product.discountPrice * product.quantity,
      productSnapshot: {
        name: product.product.name,
        coverImg: product.product.coverImg,
        description: product.product.description,
        SKU: product.product.SKU,
        slug: product.product.slug,
      },
    };
  });

  const getAddress = await userService.getAddressById(orderBody.metadata.address);

  const orderedItem = {
    item: purchasedItem,
    totalAmount: orderBody.metadata.totalAmount,
    user: orderBody.metadata.user,
    status: orderBody.paymentStatus == 'paid' ? 'Processing' : 'Pending Payment',
    shippingAddress: getAddress.address[0] ?? '',
  };

  const checkOrder = await getOrderByOrderId(orderBody.orderId);
  let createdOrder = {};
  if (checkOrder) {
    // update order
    // will do in part 2
  } else {
    // create order
    const order = new Order(orderedItem);
    createdOrder = await order.save();
  }

  return createdOrder;
};

const getOrderByOrderId = async (orderId) => {
  const order = Order.findOne({ orderId });
};

const getOrderByid = async (orderId) => {
  return await Order.findOne({ _id: orderId });
};

const getOrdersByUserId = async (userId) => {
  return await Order.find({ user: userId });
};

const getActiveOrder = async (userId) => {
  return await Order.find({ user: userId, status: { $in: ['Pending Payment', 'Processing', 'Shipped'] } });
};

const getPastOrder = async (userId) => {
  return await Order.find({ user: userId, status: { $in: ['Delivered', 'Cancelled'] } });
};

const createTransaction = async (orderBody) => {
  const transaction = new Transaction(orderBody);
  await transaction.save();

  // remove cart items

  await cartService.deleteCartByUserId(orderBody.user);
  return;
};


const reorder = async (order) => {
  const productId = order.item.map((itemms) => _id);
  return productId;
};

module.exports = {
  createOrder,
  getOrderByid,
  getOrderByid,
  getOrdersByUserId,
  getActiveOrder,
  getPastOrder,
  createTransaction,
  reorder,
};
