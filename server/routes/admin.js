const express = require('express');

const { body } = require('express-validator');
const router = express.Router();

const adminControllers = require('../controllers/admin');

const { isAdmin, isTVVorAD, isAuth } = require('../utils/is-auth');

router.post(
  '/login',
  body('email', 'Invalid email value').isEmail().normalizeEmail(),
  adminControllers.login
);

router.get('/products', isAuth, isAdmin, adminControllers.getProducts);

router.get('/chat-rooms', isAuth, isTVVorAD, adminControllers.getRoomChats);

router.get(
  '/chat-room/:roomId',
  isAuth,
  isTVVorAD,
  adminControllers.getRoomChat
);

router.post('/reply', isAuth, isTVVorAD, adminControllers.postReply);

router.get('/histories', isAuth, isAdmin, adminControllers.getHistories);

router.post(
  '/product/create',
  isAuth,
  isAdmin,
  [
    body('name').isString().isLength({ min: 3 }).trim(),
    body('category').isString().isLength({ min: 2, max: 50 }).trim(),
    body('price').isNumeric().trim(),
    body('short_desc').isString().isLength({ min: 5 }).trim(),
    body('long_desc').isString().isLength({ min: 7 }).trim(),
    body('count').isNumeric().trim(),
  ],
  adminControllers.createProduct
);

router.post(
  '/product/update',
  isAuth,
  isAdmin,
  [
    body('name').isString().isLength({ min: 3 }).trim(),
    body('category').isString().isLength({ min: 2, max: 50 }).trim(),
    body('price').isNumeric().trim(),
    body('short_desc').isString().isLength({ min: 5 }).trim(),
    body('long_desc').isString().isLength({ min: 7 }).trim(),
    body('count').isNumeric().trim(),
  ],
  adminControllers.updateProduct
);

router.delete(
  '/product/delete/:prodId',
  isAuth,
  isAdmin,
  adminControllers.removeProduct
);

module.exports = router;
