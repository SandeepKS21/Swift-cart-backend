const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const ApiError = require('../utils/ApiError');
const ApiSuccess = require('../utils/ApiSuccess');

const sendOtp = catchAsync(async (req, res) => {
  const otp = 1234;

  const getUser = await userService.getUser(req.body);
  req.body.otp = otp;

  
  if (getUser) {
    await userService.updateUserById(getUser._id, { otp });
  } else {
    await userService.createUser(req.body);
  }

  // const tokens = await tokenService.generateAuthTokens(user);
  return new ApiSuccess(res, httpStatus.OK, 'Otp sent sucessfully');
});

const verifyOtp = catchAsync(async (req, res) => {
  // const { mobile, otp } = req.body;

  const user = await userService.getUser(req.body);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  // Update user
  await userService.updateUserById(user._id, { otp: null });
  const tokens = await tokenService.generateAuthTokens(user);

  return new ApiSuccess(res, httpStatus.OK, 'Otp verified sucessfully', user, tokens);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  sendOtp,
  verifyOtp,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
