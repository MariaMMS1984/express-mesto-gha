const Card = require('../models/card');

const ErrorBadRequest = require('../errors/incorrect');
const ErrorNotFound = require('../errors/notfound');
const ErrorForbidden = require('../errors/forbidden');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.payload;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
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

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.getCard = (req, res, next) => {
  Card.findById(req.params.cardid)
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка по указанному _id не найдена или был запрошен несуществующий роут'));
      }
      return res.status(200).send(card);
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

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.payload } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка по указанному _id не найдена или был запрошен несуществующий роут'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.payload } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка по указанному _id не найдена или был запрошен несуществующий роут');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorBadRequest('Переданы некорректные данные');
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new ErrorNotFound('Карточка не найдена.'))
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user.payload)) {
        return next(new ErrorForbidden('Нельзя удалять чужие карточки.'));
      }
      return card.deleteOne()
        .then(() => res.send({ message: 'Карточка удалена.' }));
    })
    .catch(next);
};
