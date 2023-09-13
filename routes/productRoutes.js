const express = require('express');
const router = express.Router();
const { auth, authorizePermissions } = require('../middleware/authentication');
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
} = require('../controllers/productController');

const { getSingleUserReviews } = require('../controllers/reviewController');

router.route('/uploadImage').post(auth, authorizePermissions('admin'), uploadImage);
router.route('/')
  .get(getAllProducts)
  .post(auth, authorizePermissions('admin'), createProduct);
router.route('/:id')
  .get(getSingleProduct)
  .patch(auth, authorizePermissions('admin'), updateProduct)
  .delete(auth, authorizePermissions('admin'), deleteProduct);
router.route('/:id/reviews').get(getSingleUserReviews);

module.exports = router;