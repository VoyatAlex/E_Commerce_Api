const CunstomError = require('../errors/index');
const { isTokenValid } = require('../utils/jwt');

const auth = (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new UnauthenticatedError('Authentication failed');
  }

  try {
    const payload = isTokenValid({ token });
    req.user = { name: payload.name, userId: payload.userId, role: payload.role }
    next();
  } catch (error) {
    throw new CunstomError.UnauthenticatedError('Authentication failed');
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (roles.indexOf(req.user.role) === -1) {
      throw new CunstomError.UnAuthorizedError('Unauthorized to access this route.');
    }
    next();
  }
}

module.exports = { auth, authorizePermissions };