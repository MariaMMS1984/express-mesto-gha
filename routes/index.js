const express = require('express');

const routes = express.Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

routes.use('/users', userRouter);
routes.use('/cards', cardRouter);

module.exports = routes;
