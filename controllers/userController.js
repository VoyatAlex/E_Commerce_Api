const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors/index');
const { createUserToken, attachCookiesToResponse, checkPermissions } = require('../utils/index');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new CustomAPIError.NotFoundError(`No user with id ${id}`);
  }

  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json(user);
}

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
}

const updateUserPassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  const { userId } = req.user;

  if (!newPassword.trim() || !oldPassword.trim()) {
    throw new CustomAPIError.BadRequestError('New or old password is missing');
  }

  const user = await User.findById(userId);
  const isPassValid = user.comparePassword(oldPassword);

  if (!isPassValid) {
    throw new CustomAPIError.UnAuthorizedError('Old password is not valid');
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success. Password was updated.' });
}

// update user with user.save()
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const { userId } = req.user;

  if (!name.trim() || !email.trim()) {
    throw new CustomAPIError.BadRequestError('Email or name is missing');
  }

  const user = await User.findOne({ _id: userId });
  user.email = email;
  user.name = name;
  await user.save();

  const tokenUser = createUserToken(user);

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ msg: 'Success. User was updated.' });
}

module.exports = { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword };