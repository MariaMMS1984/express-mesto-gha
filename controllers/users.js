const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorBadRequest = require('../errors/incorrect');
const ErrorNotFound = require('../errors/notfound');
const UnauthorizedError = require('../errors/autharization');


const JWT_SECRET = 'secret';

const getJwtToken = (id) => {
  const token = jwt.sign({ payload: id }, JWT_SECRET, { expiresIn: '7d' });
  return token;
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => res.status(201).send({
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        }))
        .catch((err) => {
          if (err.name === 'MongoServerError' || err.code === 11000) {
            next(new ErrorConflict('Пользователь с такой почтой уже зарегистрирован.'));
          } else if (err.name === 'ValidationError') {
            next(new ErrorBadRequest('Переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userid)
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь по указанному _id не найден или был запрошен несуществующий роут'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getThisUser = (req, res, next) => {
  const userId = req.user.payload;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь по указанному _id не найден или был запрошен несуществующий роут'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user.payload;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь по указанному _id не найден или был запрошен несуществующий роут'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user.payload;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь по указанному _id не найден или был запрошен несуществующий роут'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      const token = getJwtToken(user._id);
      res
        .cookie('jwt', token, {
          maxage: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Успешная авторизация.' });
    })
    .catch(() => {
      next(new UnauthorizedError('Неверные данные для входа'));
    });
};
