const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN = '7d' } = process.env;

module.exports = {
  sign: (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }),
  verify: (token) => jwt.verify(token, JWT_SECRET)
};
