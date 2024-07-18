const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createCart = {
  body: Joi.object().keys({
    product: Joi.string().custom(objectId).required(),
    quantity: Joi.number().required(),
  }),
};

const getCartByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const updateCartProductQuantity = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    quantity: Joi.number().required(),
  }),
};

// const updateCategory = {
//   params: Joi.object().keys({
//     categoryId: Joi.required().custom(objectId),
//   }),

//   body: Joi.object()
//     .keys({
//       name: Joi.string().required(),
//     })
//     .min(1),
// };

const deleteCartById = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createCart,
  getCartByUserId,
  deleteCartById,
  updateCartProductQuantity,
};
