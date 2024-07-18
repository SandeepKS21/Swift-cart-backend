const httpStatus = require('http-status');
const { CartModel, Product } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createCart = async (product) => {
  return CartModel.create(product);
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
// const queryCart = async (filter, options) => {
//   const product = await Product.paginate(filter, options);
//   return product;
// };

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getCartyId = async (id) => {
  return CartModel.findById(id).populate('product');
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateCartById = async (cartId, updateBody) => {
  const cart = await getCartyId(cartId);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }

  Object.assign(cart, updateBody);
  await cart.save();
  return cart;
};

/**
 * Delete user by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteCartById = async (productId) => {
  const product = await getCartyId(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'cart item not found');
  }
  const removed = await CartModel.deleteOne({ _id: productId });
  return removed;
};

const getAllCart = async () => {
  return CartModel.find({ status: true }).populate('product');
};

const findCart = async (productBody) => {
  return await CartModel.find(productBody).populate('product');
};

const findOneCart = async (productBody) => {
  return CartModel.findOne(productBody).populate('product');
};

const getCartCount = async (productBody) => {
  const userId = new mongoose.Types.ObjectId(productBody.user);
  return CartModel.countDocuments({ user: userId });
};

const getCartSubTotal = async (userId) => {
  const subtotalAggegation = [
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },

    {
      $project: {
        itemTotal: { $multiply: ['$quantity', '$productDetails.discountPrice'] },
      },
    },
    {
      $group: {
        _id: null,
        subtotal: { $sum: '$itemTotal' },
      },
    },
  ];

  const productSubTotal = await CartModel.aggregate(subtotalAggegation);

  if (productSubTotal.length > 0) {
    return productSubTotal[0].subtotal;
  } else {
    return 0;
  }
};

const deleteCartByUserId = async (userId) => {
  await CartModel.deleteMany({
    user: userId,
  });

  return;
};

module.exports = {
  createCart,
  getCartyId,
  updateCartById,
  deleteCartById,
  getAllCart,
  findCart,
  findOneCart,
  getCartCount,
  getCartSubTotal,
  deleteCartByUserId,
};
