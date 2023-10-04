const express = require('express');

const users = express.Router();
const {
  createUser, getUsers, getUser, updateAvatar, updateProfile,
} = require('../controllers/users');

users.post('/', createUser);
users.get('/', getUsers);
users.get('/:userid', getUser);
users.patch('/me', updateProfile);
users.patch('/me/avatar', updateAvatar);

module.exports = users;
