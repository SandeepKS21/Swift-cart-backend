const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string().required(),
      image: Joi.string().required(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const paymentSessionId = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const paymentLink = {
  body: Joi.object().keys({
    address: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string().required(),
    paymentMode: Joi.string().required().valid('cash', 'online'),
  }),
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  paymentSessionId,
  paymentLink,
};
