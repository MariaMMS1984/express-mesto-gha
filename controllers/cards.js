const Card = require('../models/card');

const INCOORECT_ERROR_CODE = 400;
const NOTFOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена или был запрошен несуществующий роут' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена или был запрошен несуществующий роут' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCard = (req, res) => {
  Card.findById(req.params.cardid)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена или был запрошен несуществующий роут' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена или был запрошен несуществующий роут' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена или был запрошен несуществующий роут' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCOORECT_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOTFOUND_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена или был запрошен несуществующий роут' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
