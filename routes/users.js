const express = require('express');

const users = express.Router();
const {
  validateUserId,
  validateUserUpdate,
  validateUserAvatar,
} = require('../middlewares/validate');
const {
  getUsers, getUser, getThisUser, updateAvatar, updateProfile,
} = require('../controllers/users');

users.get('/', getUsers);


users.patch('/me', validateUserUpdate, updateProfile);
users.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = users;
