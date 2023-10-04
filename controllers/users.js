const User = require('../models/user');

const INCOORECT_ERROR_CODE = 400;
const NOTFOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден или был запрошен несуществующий роут' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден или был запрошен несуществующий роут' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userid)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден или был запрошен несуществующий роут' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные аватара пользователя' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден или был запрошен несуществующий роут' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные профиля пользователя' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден или был запрошен несуществующий роут' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};