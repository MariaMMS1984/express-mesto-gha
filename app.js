const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '6517388f76bb1f335ee715d2', // вставьте сюда _id созданного в предыдущем пункте пользователя

  };
  next();
});
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { validateCreateUser, validateLogin } = require('./middlewares/validate');

app.use(cookieParser());
const auth = require('./middlewares/auth');

const {
  createUser, login,
} = require('./controllers/users');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.use(auth);
app.use('/', require('./routes/index'));

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
app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
