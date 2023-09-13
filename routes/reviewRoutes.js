const express = require('express');
const router = express.Router();
const { authorizePermissions, auth } = require('../middleware/authentication');
const { createReview, getAllReviews, getSingleReview, updateReview, deleteReview } = require('../controllers/reviewController');

router.route('/')
  .get(getAllReviews)
  .post(auth, createReview);
router.route('/:id')
  .get(getSingleReview)
  .patch(auth, updateReview)
  .delete(auth, deleteReview);

module.exports = router;