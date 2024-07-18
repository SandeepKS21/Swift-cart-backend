const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, paymentService, cartService, orderService } = require('../services');
const ApiSuccess = require('../utils/ApiSuccess');
const { off } = require('../models/token.model');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return new ApiSuccess(res, httpStatus.OK, 'User details fetched sucessfully', user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user.id, req.body);
  return new ApiSuccess(res, httpStatus.OK, 'User details update sucessfully', user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addAddress = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  if (user && user.address && user.address.length >= 2) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You can only add up to 2 addresses.');
  }

  const address = await userService.addUserAddress(req.user.id, req.body);

  return new ApiSuccess(res, httpStatus.OK, 'Address added sucessfully', address);
});

const getAddressById = catchAsync(async (req, res) => {
  const { addressId } = req.params;

  const data = await userService.getAddressById(addressId);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }

  return new ApiSuccess(res, httpStatus.OK, 'Address added sucessfully', data.address[0]);
});

const updateAddressById = catchAsync(async (req, res) => {
  const { addressId } = req.params;

  const data = await userService.getAddressById(addressId);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }

  const updatedAddress = await userService.updateAddressById(addressId, req.body);

  return new ApiSuccess(res, httpStatus.OK, 'Address added sucessfully', updatedAddress);
});

const generatePaymentLink = catchAsync(async (req, res) => {
  let { customerId } = req.user;
  const cartBody = {
    user: req.user.id,
  };

  const cart = await cartService.findCart(cartBody);

  if (cart.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart is empty.');
  }

  const totalAmount = await cartService.getCartSubTotal(req.user.id);

  if (!customerId) {
    customerId = await paymentService.createCustomer(req.user);

    await userService.updateUserById(req.user.id, { customerId: customerId });
  }

  req.body.user = req.user.id;
  const paymentLinkRes = await paymentService.createPaymentLink(totalAmount, req.user, customerId, req.body);

  return new ApiSuccess(res, httpStatus.OK, 'Payment link', paymentLinkRes);
});

const paymentSucess = catchAsync(async (req, res) => {
  const { session_id } = req.query;

  const paymentStatus = await paymentService.paymentSuccess(session_id);

  if (paymentStatus.payment_status === 'paid') {
    // payment sucess
    console.log(paymentStatus.payment_status);
  }

  return new ApiSuccess(res, httpStatus.OK, 'Payment sucessfully');
});

const paymentFailed = catchAsync(async (req, res) => {
  return new ApiSuccess(res, httpStatus.OK, 'Payment cancelled. Please try again');
});

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder();

  return new ApiSuccess(res, httpStatus.OK, 'order created sucessfully', order);
});

const getOrderList = catchAsync(async (req, res) => {
  const activeOrder = await orderService.getActiveOrder(req.user.id);

  const pastOrder = await orderService.getPastOrder(req.user.id);
  const order = {
    activeOrder,
    pastOrder,
  };

  return new ApiSuccess(res, httpStatus.OK, 'order fetched sucessfully', order);
});

const getOrderById = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await orderService.getOrderByid(orderId);

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return new ApiSuccess(res, httpStatus.OK, 'order fetched sucessfully', order);
});

const reorder = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const getOrder = await orderService.getOrderByid(orderId);

  if (!getOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  const order = orderService.reorder(getOrder);

  return new ApiSuccess(res, httpStatus.OK, 'order fetched sucessfully', order);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addAddress,
  getAddressById,
  updateAddressById,
  paymentSucess,
  paymentFailed,
  generatePaymentLink,
  createOrder,
  getOrderList,
  getOrderById,
  reorder,
};
