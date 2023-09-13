const express = require('express');
const router = express.Router();
const { auth, authorizePermissions } = require('../middleware/authentication');
const { getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder } = require('../controllers/orderController');

router.route('/showAllMyOrders').get(auth, getCurrentUserOrders);
router.route('/')
  .get(auth, authorizePermissions('admin'), getAllOrders)
  .post(auth, createOrder);
router.route('/:id')
  .get(auth, getSingleOrder)
  .patch(auth, updateOrder);

module.exports = router;