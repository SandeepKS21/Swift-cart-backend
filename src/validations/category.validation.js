const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    isActive: Joi.boolean().required(),
  }),
};

const getCategoryById = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.required().custom(objectId),
  }),

  body: Joi.object()
    .keys({
      name: Joi.string().required(),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
