const express = require('express');

const routes = express.Router();
const NOTFOUND_ERROR_CODE = 404;

routes.use('/', (req, res) => {
  res.status(NOTFOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден или был запрошен несуществующий роут' });
});

routes.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = routes;
