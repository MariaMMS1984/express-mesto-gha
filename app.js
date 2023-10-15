const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { validateCreateUser, validateLogin } = require('./middlewares/validate');
const auth = require('./middlewares/auth');

const {
  createUser, login,
} = require('./controllers/users');
const ErrorNotFound = require('./errors/notfound');

app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', validateCreateUser, createUser);
app.use(auth);
app.use('/', require('./routes/index'));

app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.use((req, res, next) => {
  next(new ErrorNotFound('Такой страницы не существует.'));
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
