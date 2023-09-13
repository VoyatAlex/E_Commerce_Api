const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/index');
const { checkPermissions } = require('../utils/index');

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isProductValid = await Product.findOne({ _id: productId });

  if (!isProductValid) {
    throw new CustomError.NotFoundError(`No product with id ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({ user: req.user.userId, product: productId });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(`Already submitted review for this product ${productId}`);
  }

  req.body.user = req.user.userId;

  const review = await Review.create(req.body);
  res.status(StatusCodes.OK).json({ review });
}

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({ path: 'product', select: 'company name price' })

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
}

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId })
    .populate({ path: 'product', select: 'company name price' });

  if (!review) {
    throw new CustomError.BadRequestError(`No review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.BadRequestError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();

  res.status(StatusCodes.OK).json({ review });
}

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.BadRequestError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  await review.deleteOne({ _id: reviewId });

  res.status(StatusCodes.OK).json({ msg: 'success' });
}

const getSingleUserReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
}

module.exports = { createReview, getAllReviews, getSingleReview, updateReview, deleteReview, getSingleUserReviews };