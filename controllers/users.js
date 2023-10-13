const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const INCOORECT_ERROR_CODE = 400;
const NOTFOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;
const AUTHORIZATION_ERROR = 401;
const JWT_SECRET = 'secret';

const getJwtToken = (id) => {
  const token = jwt.sign({ payload: id }, JWT_SECRET, { expiresIn: '7d' });
  return token;
};

module.exports.createUser = (req, res) => {
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
          if (err.name === 'ValidationError') {
            res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
          } else {
            res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
          }
        });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => {
      error.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userid)
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден или был запрошен несуществующий роут' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getThisUser = (req, res) => {
  const userId = req.user.payload;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден или был запрошен несуществующий роут' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user.payload;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден или был запрошен несуществующий роут' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные аватара пользователя' });
      } else if (err.name === 'CastError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const userId = req.user.payload;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден или был запрошен несуществующий роут' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные профиля пользователя' });
      } else if (err.name === 'CastError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
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
      next(new AUTHORIZATION_ERROR('Неверные данные для входа'));
    });
};
