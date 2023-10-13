const express = require('express');

const users = express.Router();

const {
  getUsers, getUser, getThisUser, updateAvatar, updateProfile,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/me', getThisUser);
users.get('/:userid', getUser);
users.patch('/me', updateProfile);
users.patch('/me/avatar', updateAvatar);

module.exports = users;
