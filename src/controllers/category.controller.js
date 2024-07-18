const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const ApiSuccess = require('../utils/ApiSuccess');
const { default: slugify } = require('slugify');

const createCategory = catchAsync(async (req, res) => {
  const categorySlug = slugify(req.body.name);
  req.body.slug = categorySlug;
  const category = await categoryService.createCategory(req.body);

  return new ApiSuccess(res, httpStatus.CREATED, 'category created successfully', category);
});

// const getCategory = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['name', 'role']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await categoryService.queryUsers(filter, options);
//   res.send(result);
// });

const getAllCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getAllCategory();
  return new ApiSuccess(res, httpStatus.OK, 'category fetched', category);
});

// const getUser = catchAsync(async (req, res) => {
//   const user = await userService.getUserById(req.params.userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   res.send(user);
// });

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.userId, req.body);

  return new ApiSuccess(res, httpStatus.OK, 'category updated successfully', category);
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.userId);

  return new ApiSuccess(res, httpStatus.NO_CONTENT, 'category deleated successfully');
});

const getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);

  if(!category)
  {
    throw new ApiError(httpStatus.NOT_FOUND, 'category not found');

  }

  return new ApiSuccess(res, httpStatus.OK, 'category fetched successfully', category);
});

module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
