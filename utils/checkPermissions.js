const CustomErrors = require('../errors/index');

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === 'admin') {
    return;
  }

  if (requestUser.userId === resourceUserId.toString()) {
    return;
  }

  throw new CustomErrors.UnAuthorizedError('Not authorized to get access to this route');
}

module.exports = checkPermissions;