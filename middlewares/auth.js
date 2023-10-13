const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret';

const UnauthorizedError = require('../errors/autharization');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация.');
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Неправильный токен. Необходима авторизация.');
  }

  req.user = payload;

  next();
};
