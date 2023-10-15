const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorBadRequest = require('../errors/incorrect');
const ErrorNotFound = require('../errors/notfound');
const ErrorConflict = require('../errors/repeat');

const JWT_SECRET = 'secret';

const getJwtToken = (id) => {
  const token = jwt.sign({ payload: id }, JWT_SECRET, { expiresIn: '7d' });
  return token;
};

const createUser = (req, res, next) => {
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
        .catch((error) => {
          if (error.name === 'MongoServerError' || error.code === 11000) {
            next(new ErrorConflict('Пользователь с такой почтой уже зарегистрирован.'));
          } else if (error.name === 'ValidationError') {
            next(new ErrorBadRequest('Переданы неккоректные данные для создания пользователя.'));
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
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
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userid)
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь не найден.'));
      } else res.send(user);
    })
    .catch(next);
};

const getThisUser = (req, res, next) => {
  User.findById(req.user.payload)
    .then((user) => res.send(user))
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user.payload,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorBadRequest('Передан некорректный id пользователя.'));
      } else {
        next(error);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user.payload,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Пользователь не найден.'));
      } else res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorBadRequest('Передан некорректный id пользователя.'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUser,
  getThisUser,
  updateProfile,
  updateAvatar,
};
