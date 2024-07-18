const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createCategory = async (category) => {
  return Category.create(category);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategory = async (filter, options) => {
  const category = await Category.paginate(filter, options);
  return category;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getCategoryById = async (id) => {
  return Category.findById(id);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'category not found');
  }

  Object.assign(category, updateBody);
  await Category.save();
  return category;
};

/**
 * Delete user by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getUserById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'category not found');
  }
  await Category.remove();
  return category;
};

const getAllCategory = async () => {
  return await Category.find({ isActive: true, isDeleted: false });
};

module.exports = {
  createCategory,
  queryCategory,
  updateCategoryById,
  deleteCategoryById,
  getCategoryById,
  getAllCategory,
};
