const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createProduct = async (product) => {
  return Product.create(product);
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
const queryProduct = async (filter, options) => {
  const product = await Product.paginate(filter, options);
  return product;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getProductById = async (userId, productId) => {
  // return Product.findById(id).populate('category', 'name');

  let pipeline = [
    {
      $match: { isActive: true, isDeleted: false, _id: new mongoose.Types.ObjectId(productId) },
    },
    {
      $lookup: {
        from: 'carts', // Assuming your Cart model is named 'Cart' and the collection name is 'carts'
        let: { productId: '$_id', userId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$product', '$$productId'] }, { $eq: ['$user', new mongoose.Types.ObjectId(userId)] }],
              },
            },
          },
        ],
        as: 'cart',
      },
    },
    {
      $addFields: {
        isCart: { $cond: { if: { $gt: [{ $size: '$cart' }, 0] }, then: true, else: false } },
      },
    },
    {
      $unset: 'cart',
    },
    {
      $lookup: {
        from: 'categories', // Assuming your Category model is named 'Category' and the collection name is 'categories'
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        images: 1,
        rating: 1,
        isDeleted: 1,
        isPopular: 1,
        coverImg: 1,
        originalPrice: 1,
        discountPrice: 1,
        SKU: 1,
        slug: 1,
        category: { $arrayElemAt: ['$category', 0] },
        isCart: 1,
      },
    },
  ];

  if (!userId) {
    pipeline = pipeline.map((stage) => {
      if (stage.$addFields && stage.$addFields.isCart) {
        stage.$addFields.isCart = false;
      }
      return stage;
    });
  }

  const product = await Product.aggregate(pipeline);
  return product[0];
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }

  Object.assign(product, updateBody);
  await Product.save();
  return product;
};

/**
 * Delete user by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }
  await product.remove();
  return product;
};

const getAllProduct = async (userId) => {
  let pipeline = [
    {
      $match: { isActive: true, isDeleted: false },
    },
    {
      $lookup: {
        from: 'carts', // Assuming your Cart model is named 'Cart' and the collection name is 'carts'
        let: { productId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$product', '$$productId'] },
                  { $eq: ['$user', new mongoose.Types.ObjectId(userId)] }, // Assuming 'userId' holds the user's ObjectId
                ],
              },
            },
          },
        ],
        as: 'cart',
      },
    },
    {
      $addFields: {
        isCart: { $cond: { if: { $gt: [{ $size: '$cart' }, 0] }, then: true, else: false } },
      },
    },
    {
      $unset: 'cart',
    },
    {
      $lookup: {
        from: 'categories', // Assuming your Category model is named 'Category' and the collection name is 'categories'
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        images: 1,
        rating: 1,
        isDeleted: 1,
        isPopular: 1,
        coverImg: 1,
        originalPrice: 1,
        discountPrice: 1,
        SKU: 1,
        slug: 1,
        category: { $arrayElemAt: ['$category', 0] },
        isCart: 1,
      },
    },
  ];

  if (!userId) {
    pipeline = pipeline.map((stage) => {
      if (stage.$addFields && stage.$addFields.isCart) {
        stage.$addFields.isCart = false;
      }
      return stage;
    });
  }

  return Product.aggregate(pipeline);

  // return Product.find({ isActive: true, isDeleted: false }).populate('category', 'name');
};

const findProduct = async (productBody) => {
  return Product.find(productBody).populate('category', 'name');
};

const searchProduct = async ({ search }) => {
  // const product = await Product.find({
  //   name: {
  //     $regex: search,
  //     $options: 'i',
  //   },
  // });

  const product = Product.aggregate([
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
      },
    },
    {
      $unwind: '$category',
    },
    {
      $match: {
        $or: [{ name: { $regex: search, $options: 'i' } }, { 'category.name': { $regex: search, $options: 'i' } }],
      },
    },
  ]);

  return product;
};

module.exports = {
  createProduct,
  queryProduct,
  updateProductById,
  deleteProductById,
  getProductById,
  getAllProduct,
  findProduct,
  searchProduct,
};
