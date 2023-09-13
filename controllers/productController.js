const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomErrors = require('../errors/index');
const path = require('path');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
}
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
}
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.find({ _id: productId }).populate({ path: 'reviews' });

  if (product.length === 0) {
    throw new CustomErrors.NotFoundError(`No product found with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
}
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, { new: true, runValidators: true });

  if (!product) {
    throw new CustomErrors.NotFoundError(`No product found with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
}
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomErrors.NotFoundError(`No product found with id : ${productId}`);
  }

  await product.deleteOne();
  res.status(StatusCodes.OK).json({ success: 'Product removed' });
}
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomErrors.BadRequestError('No file Uploaded');
  }

  const productImage = req.files.image;
  const maxSize = 1024 * 1024;

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomErrors.BadRequestError('Please upload image');
  }

  if (productImage.size > maxSize) {
    throw new CustomErrors.BadRequestError('Please upload image less than 1mb');
  }

  const imagePath = path.join(__dirname, '../public/uploads/' + productImage.name);

  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: '/uploads/' + productImage.name });
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
}