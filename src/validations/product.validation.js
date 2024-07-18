const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    status: Joi.boolean().allow(''),
    category: Joi.string().custom(objectId).required(),
    coverImg: Joi.string().required(),
    images: Joi.array().required(),
    originalPrice: Joi.number().required().positive().min(1),
    discountPrice: Joi.number().required().positive().min(1),
    description: Joi.string().allow(''),
    rating: Joi.number().required(),
  }),
};

// const getUsers = {
//   query: Joi.object().keys({
//     name: Joi.string(),
//     role: Joi.string(),
//     sortBy: Joi.string(),
//     limit: Joi.number().integer(),
//     page: Joi.number().integer(),
//   }),
// };

const getProductById = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),

  body: Joi.object()
    .keys({
      name: Joi.string().allow(''),
      status: Joi.boolean().allow(''),
      category: Joi.string().custom(objectId),
      coverIma: Joi.string().allow(''),
      images: Joi.array().allow(''),
      originalPrice: Joi.number().allow('').positive().min(1),
      discountPrice: Joi.number().allow('').positive().min(1),
      description: Joi.string().allow(''),
      rating: Joi.number().allow(''),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const searchProduct = {
  params: Joi.object().keys({
    search: Joi.string().allow(''),
  }),
};

module.exports = {
  createProduct,
  // getUsers,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProduct,
};
