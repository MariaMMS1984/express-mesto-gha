const express = require('express');

const routes = express.Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

const NOTFOUND_ERROR_CODE = 404;

routes.use('/users', userRouter);
routes.use('/cards', cardRouter);
routes.use('/', (req, res) => {
  res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден или был запрошен несуществующий роут' });
});

routes.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = routes;
