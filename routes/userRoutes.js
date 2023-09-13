const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword } = require('../controllers/userController');
const { auth, authorizePermissions } = require('../middleware/authentication');

router.route('/').get(auth, authorizePermissions('admin', 'owner'), getAllUsers);
router.route('/showMe').get(auth, showCurrentUser);
router.route('/updateUser').patch(auth, updateUser);
router.route('/updateUserPassword').patch(auth, updateUserPassword);
router.route('/:id').get(auth, getSingleUser);

module.exports = router;