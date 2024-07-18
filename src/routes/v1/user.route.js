const express = require('express');
const { auth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser);

router.route('/address').patch(auth('manageUsers'), userController.addAddress);
router.route('/address/:addressId').get(auth('manageUsers'), userController.getAddressById);
router.route('/address/:addressId').patch(auth('manageUsers'), userController.updateAddressById);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

// payment
router
  .route('/payment/generate-link')
  .post(auth('manageUsers'), validate(userValidation.paymentLink), userController.generatePaymentLink);

// payment sucess and fail route
router.route('/checkout/payment-success').get(validate(userValidation.paymentSessionId), userController.paymentSucess);

router.route('/checkout/payment-cancel').get(userController.paymentFailed);

router.route('/order').post(validate(userValidation.paymentSessionId), userController.createOrder);

router.route('/order/list').get(auth('manageUsers'), userController.getOrderList);
router.route('/order/details/:orderId').get(auth('manageUsers'), userController.getOrderById);

router.route('/reorder/:orderId').patch(auth('manageUsers'), userController.reorder);

module.exports = router;
