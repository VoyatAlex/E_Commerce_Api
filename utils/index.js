const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createUserToken = require('./createTokenUser');
const checkPermissions = require('./checkPermissions');

module.exports = {
  checkPermissions,
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createUserToken
}