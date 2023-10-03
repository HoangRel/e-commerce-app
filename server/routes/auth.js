const express = require('express');
const authControllers = require('../controllers/auth');
const { body } = require('express-validator');

const User = require('../models/user');

const router = express.Router();

router.post(
  '/login',
  body('email', 'Invalid email value').isEmail().normalizeEmail(),
  authControllers.postLogin
);

router.post(
  '/signup',
  [
    body('name', 'Invalid name value').isString().isLength({ min: 2 }).trim(),
    body('email')
      .isEmail()
      .withMessage('Invalid email value')
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      }),
    body('password', 'Valid password least 6 characters.')
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body('phone', 'Invalid phone value').isMobilePhone('vi-VN'),
  ],
  authControllers.postSignUp
);

router.post('/logout', authControllers.postLogout);

module.exports = router;
