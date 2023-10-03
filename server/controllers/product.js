const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const Product = require('../models/product');
const Order = require('../models/order');

const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      return res.json(products);
    })
    .catch(err => {
      next(new Error(err));
    });
};

// lấy product cùng với các product cùng category
exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.prodId;

    const product = await Product.findById(prodId);
    if (!product) {
      return res.status(404).json({ message: 'This product not found!' });
    }

    let relatedProducts;
    try {
      relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: prodId },
      });
    } catch (err) {
      console.log(err);
      relatedProducts = [];
    }

    return res.json({ product, relatedProducts });
  } catch (err) {
    next(err);
  }
};

exports.getCarts = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    // .execPopulate()
    .then(user => {
      const products = user.cart.items.map(product => {
        return {
          id: product.productId._id,
          img: product.productId.img1,
          name: product.productId.name,
          price: product.productId.price,
          quantity: product.quantity,
        };
      });

      return res.json(products);
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.addToCart = (req, res, next) => {
  const prodId = req.body.prodId;
  const quantity = req.body.quantity;

  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.status(422).json({ message: 'This product not found!' });
      }

      return req.user.addCart(product, quantity);
    })
    .then(result => {
      return res.json({ message: 'added!' });
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.updateQuantity = (req, res, next) => {
  const prodId = req.body.productId;
  const quantity = req.body.quantity;

  req.user
    .updateQty(prodId, quantity)
    .then(result => {
      return res.json({ message: 'updated!' });
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;

  req.user
    .removeFromCart(prodId)
    .then(result => {
      return res.json({ message: 'deleted!' });
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.postOrder = (req, res, next) => {
  const data = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const msg = [];
    errors.array().forEach(err => {
      msg.push(err.path);
    });

    return res.status(422).json({ msg });
  }

  req.user
    .populate('cart.items.productId')
    .then(async user => {
      if (user.cart.items.length === 0) {
        return res.status(401).json({ message: 'No Products in the Cart' });
      }

      const products = user.cart.items.map(item => {
        return {
          quantity: item.quantity,
          product: {
            _id: item.productId._id,
            img: item.productId.img1,
            name: item.productId.name,
            price: item.productId.price,
          },
        };
      });

      ////

      // Kiểm tra số lượng hàng
      const insufficientProducts = [];

      for (let item of products) {
        const prod = await Product.findById(item.product._id);
        if (prod.count < item.quantity) {
          // Thêm thông tin sản phẩm không đủ vào mảng
          insufficientProducts.push({
            prodId: item.product._id,
            name: item.product.name,
            count: prod.count,
          });
        }
      }

      // Kiểm tra mảng sản phẩm không đủ hàng
      if (insufficientProducts.length > 0) {
        return res.status(400).json({
          message: 'Lượng hàng trong kho không đủ:',
          resData: insufficientProducts,
        });
      }

      // nếu all các sảm phẩm đều đủ hàng, thì cập nhật count

      for (let item of products) {
        const prod = await Product.findById(item.product._id);
        prod.count = prod.count - item.quantity;
        await prod.save();
      }

      /////

      const order = new Order({
        userId: user._id,
        ...data,
        items: [...products],
      });
      await order.save();

      await req.user.clearCart();

      let mailDetail = {
        from: 'Shop@shop.com',
        to: order.email,
        subject: 'Đơn đặt hàng',
        html: `
        <h2>Xin Chào ${order.name}</h2>
        <h5>Phone: ${order.phone}</h5>
        <h5>address: ${order.address}</h5>
        <table>
          <thead>
            <tr>
              <th style="border: 1px solid">Tên Sản Phẩm</th>
              <th style="border: 1px solid">Hình Ảnh</th>
              <th style="border: 1px solid">Giá</th>
              <th style="border: 1px solid">Số Lượng</th>
              <th style="border: 1px solid">Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(item => {
                return `<tr>
                <td style="text-align: center; border: 1px solid; padding: 7px">${
                  item.product.name
                }</td>
                <td style="text-align: center; border: 1px solid; padding: 7px">
                  <img style="width:100px;" src="${item.product.img}"/>
                </td>
                <td style="text-align: center; border: 1px solid; padding: 7px">${Intl.NumberFormat(
                  'vi-VI'
                ).format(item.product.price)} VND</td>
                <td style="text-align: center; border: 1px solid; padding: 7px">${Intl.NumberFormat(
                  'vi-VI'
                ).format(item.quantity)}</td>
                <td style="text-align: center; border: 1px solid; padding: 7px">${Intl.NumberFormat(
                  'vi-VI'
                ).format(item.product.price * item.quantity)} VND</td>
              </tr>`;
              })
              .join('')}
          </tbody>
        </table>
        <h2>
          Tổng Thanh Toán: <br> ${Intl.NumberFormat('vi-VI').format(
            order.totalPrice
          )} VND
        </h2>
        <h3>Cảm ơn bạn!</h3>
        `,
      };

      mailTransporter.sendMail(mailDetail, function (err, data) {
        if (err) {
          console.log(err);
        }
      });

      return res.json({ message: 'Ordered successfully!' });
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id })
    .then(orders => {
      return res.json(orders);
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.getOrder = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return res.status(401).json({ message: 'This order not found' });
      }

      if (order.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'This order not found' });
      }

      return res.json(order);
    })
    .catch(err => {
      next(new Error(err));
    });
};
