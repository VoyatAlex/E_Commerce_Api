const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/index');
const { attachCookiesToResponse, createUserToken } = require('../utils/index');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const userData = { name, email, password };
  const isEmailAlreadyExist = await User.findOne({ email });

  // check if the email is already in the system
  if (isEmailAlreadyExist) {
    throw new CustomError.BadRequestError('Email is already exists');
  }

  const isTheFirstUser = await User.countDocuments({}) === 0;
  const role = isTheFirstUser ? 'admin' : 'user';

  userData.role = role;

  const user = await User.create(userData);
  const tokenUser = createUserToken(user);

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim()) {
    throw new CustomError.BadRequestError('Provide the password and email.');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Email is incorrect');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new CustomError.UnauthenticatedError('Password is incorrect');
  }

  const tokenUser = createUserToken(user);

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === 'production',
    signed: true
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

module.exports = { register, login, logout }