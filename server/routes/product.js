const express = require('express');
const { body } = require('express-validator');

const productControllers = require('../controllers/product');
const { isAuth } = require('../utils/is-auth');

const router = express.Router();

router.get('/products', productControllers.getProducts);

router.get('/product/:prodId', productControllers.getProduct);

router.get('/carts', isAuth, productControllers.getCarts);

router.post('/add-cart', isAuth, productControllers.addToCart);

router.put('/update-qty', isAuth, productControllers.updateQuantity);

router.post('/delete-cart-product', isAuth, productControllers.deleteProduct);

router.post(
  '/order',
  isAuth,
  [
    body('name').isString().isLength({ min: 2 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('phone').isMobilePhone('vi-VN'),
    body('address').isString().isLength({ min: 5 }).trim(),
    body('totalPrice').isNumeric(),
  ],
  productControllers.postOrder
);

router.get('/orders', isAuth, productControllers.getOrders);

router.get('/order/:orderId', isAuth, productControllers.getOrder);

module.exports = router;
