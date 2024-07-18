const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService, userService } = require('../services');
const ApiSuccess = require('../utils/ApiSuccess');
const { default: slugify } = require('slugify');

const createProduct = catchAsync(async (req, res) => {
  const categorySlug = slugify(req.body.name);
  req.body.slug = categorySlug;
  const product = await productService.createProduct(req.body);
  return new ApiSuccess(res, httpStatus.CREATED, 'product created successfully', product);
});

// const getCategory = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'role']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await productService.queryUsers(filter, options);
//   res.send(result);
// });

const getAllProduct = catchAsync(async (req, res) => {
  const user = req.user?.id;

  const product = await productService.getAllProduct(user);
  return new ApiSuccess(res, httpStatus.OK, 'product fetched', product);
});

// const getUser = catchAsync(async (req, res) => {
//   const user = await userService.getUserById(req.params.userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   res.send(user);
// });

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.userId, req.body);

  return new ApiSuccess(res, httpStatus.OK, 'product fetched', product);
});

const deleteProductById = catchAsync(async (req, res) => {
  await productService.deleteCategoryById(req.params.userId);

  return new ApiSuccess(res, httpStatus.NO_CONTENT, 'product deleated successfully');
});

const getProductById = catchAsync(async (req, res) => {
  const user = req.user?.id;
  const { productId } = req.params;

  const product = await productService.getProductById(user, productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }

  const relatedProduct = await productService.getAllProduct();

  // const products = product.toObject();
  product.relatedProduct = relatedProduct;

  return new ApiSuccess(res, httpStatus.OK, 'product fetched successfully', product);
});

const searchProduct = catchAsync(async (req, res) => {
  const { search } = req.body;
  const product = await productService.searchProduct(req.body);

  if (req.user && req.user.id && search !== '' && !req.user.recentSearch?.includes(search)) {
    const updateUserRecentSearch = await userService.updateRecentSearch(req.user.id, search, req.user.recentSearch.length);
  }

  return new ApiSuccess(res, httpStatus.OK, 'product fetched successfully', product);
});

module.exports = {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProductById,
  getProductById,
  searchProduct,
};
