const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');
const ApiSuccess = require('../utils/ApiSuccess');

const addToCart = catchAsync(async (req, res) => {
  req.body.user = req.user.id;

  const cartBody = {
    user: req.user.id,
    product: req.body.product,
  };

  const checkProduct = await cartService.findOneCart(cartBody);

  if (checkProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product already added');
  }
  const product = await cartService.createCart(req.body);
  return new ApiSuccess(res, httpStatus.CREATED, 'product added successfully', product);
});

// const getCategory = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'role']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await productService.queryUsers(filter, options);
//   res.send(result);
// });

const getAllCart = catchAsync(async (req, res) => {
  const cart = await cartService.getAllCart();
  return new ApiSuccess(res, httpStatus.OK, 'cart fetched', cart);
});

const updateCart = catchAsync(async (req, res) => {
  const product = await cartService.updateCartById(req.params.userId, req.body);

  return new ApiSuccess(res, httpStatus.OK, 'product fetched', product);
});

const deleteCartItemById = catchAsync(async (req, res) => {
  await cartService.deleteCartById(req.params.cartId);

  const cartBody = {
    user: req.user.id,
  };

  const product = await cartService.findCart(cartBody);
  let products = (cartItem = { cartItem: product });
  const cartCount = await cartService.getCartCount(cartBody);

  products.cartCount = cartCount;

  return new ApiSuccess(res, httpStatus.OK, 'Cart item deleated successfully', products);
});

const getCartById = catchAsync(async (req, res) => {
  const product = await cartService.getCartyId(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'cart not found');
  }

  return new ApiSuccess(res, httpStatus.OK, 'cart items fetched successfully', product);
});

const getCartByUserId = catchAsync(async (req, res) => {
  const cartBody = {
    user: req.user.id,
  };

  const cart = await cartService.findCart(cartBody);
  let products = (cartItem = { cartItem: cart });
  const cartCount = await cartService.getCartCount(cartBody);
  const subTotal = await cartService.getCartSubTotal(req.user.id);

  products.subTotal = subTotal;
  products.cartCount = cartCount;

  return new ApiSuccess(res, httpStatus.OK, 'cart items fetched successfully', products);
});

const updateCartProductQuantity = catchAsync(async (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;
  const cartBody = {
    user: req.user.id,
    _id: cartId,
  };

  const cart = await cartService.findOneCart(cartBody);

  if (!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'cart not found');
  }

  const updatedCart = await cartService.updateCartById(cart._id, { quantity });

  return new ApiSuccess(res, httpStatus.OK, 'cart items fetched successfully', updatedCart);
});

module.exports = {
  addToCart,
  getAllCart,
  updateCart,
  deleteCartItemById,
  getCartById,
  getCartByUserId,
  updateCartProductQuantity,
};
