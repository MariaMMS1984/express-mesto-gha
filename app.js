const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
