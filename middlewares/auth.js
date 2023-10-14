const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/autharization');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'magic-key');
  } catch (err) {
    throw new UnauthorizedError({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
