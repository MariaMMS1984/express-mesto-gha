const express = require('express');

const cards = express.Router();
const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/validate');
const {
  createCard, getCards, getCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cards.post('/', validateCreateCard, createCard);
cards.get('/', getCards);
cards.get('/:cardid', getCard);
cards.delete('/:cardId', validateCardId, deleteCard);
cards.put('/:cardId/likes', validateCardId, likeCard);
cards.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = cards;
