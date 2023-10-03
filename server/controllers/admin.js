const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const path = require('path');
const socket = require('../socket');

const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const ChatRoom = require('../models/chat-room');

const { deleteFile } = require('../utils/file');

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array()[0].msg;
    return res.status(422).json({ message: msg });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).json({ message: 'this email not found!' });
      }

      if (
        user.role === 'CLIENT' ||
        (user.role !== 'ADMIN' && user.role !== 'TVV')
      ) {
        return res.status(403).json({ message: 'beyond authority!' });
      }

      bcrypt.compare(password, user.password).then(doMatch => {
        if (!doMatch) {
          return res.status(422).json({ message: 'invalid password' });
        }

        req.session.isLoggedIn = true;
        req.session.user = user;

        return req.session.save(err => {
          if (!err) {
            if (user.role === 'ADMIN') {
              return res.json({
                role: 'ADMIN',
                message: 'Logged in successfully',
              });
            } else if (user.role === 'TVV') {
              return res.json({
                role: 'TVV',
                message: 'Logged in successfully',
              });
            }
          }
        });
      });
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.json(products);
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.getRoomChats = (req, res, next) => {
  ChatRoom.find()
    .then(chatRooms => {
      return res.json(chatRooms);
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.getRoomChat = (req, res, next) => {
  const roomId = req.params.roomId;

  ChatRoom.findById(roomId)
    .then(roomChat => {
      if (!roomChat) {
        res.status(422).json({ message: 'This room not found!' });
      }

      return res.json(roomChat);
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.postReply = (req, res, next) => {
  const textValue = req.body.text;
  const roomId = req.body.roomId || null;

  ChatRoom.findById(roomId)
    .then(room => {
      if (!room) {
        res.status(422).json({ message: 'This room not found!' });
      }

      return room.pushMessage(textValue, false).then(result => {
        socket
          .getIo()
          .to(roomId)
          .emit('receive_message', {
            roomId,
            message: { text: textValue, isClient: false },
          });

        res.json({ message: 'send', roomId: result._id });
      });
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.getHistories = (req, res, next) => {
  Order.find()
    .then(orders => {
      return res.json(orders);
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.createProduct = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const count = req.body.count;
  const category = req.body.category;
  const short_desc = req.body.short_desc;
  const long_desc = req.body.long_desc;
  const images = req.files;
  const domain = req.get('host');
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const msg = errors.array()[0].msg;
    return res.status(422).json({ message: msg });
  }

  const imageURL = images.map(item => {
    return 'https://' + domain + '/' + item.path.replace('\\', '/');
  });

  const [img1, img2, img3, img4] = imageURL;

  const product = new Product({
    name,
    price,
    count,
    category,
    short_desc,
    long_desc,
    img1,
    img2,
    img3,
    img4,
  });

  product
    .save()
    .then(() => {
      res.status(201).json({ message: 'Add new product success' });
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.updateProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const name = req.body.name;
  const price = req.body.price;
  const count = req.body.count;
  const category = req.body.category;
  const short_desc = req.body.short_desc;
  const long_desc = req.body.long_desc;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array()[0].msg;
    return res.status(422).json({ message: msg });
  }

  Product.findByIdAndUpdate(prodId, {
    name,
    price,
    count,
    category,
    short_desc,
    long_desc,
  })
    .then(result => {
      return res.json({ message: 'Updated!' });
    })
    .catch(err => {
      next(new Error(err));
    });
};

exports.removeProduct = (req, res, next) => {
  const prodId = req.params.prodId;

  Product.findByIdAndDelete(prodId)
    .then(result => {
      if (!result) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const imagesPath = [result.img1, result.img2, result.img3, result.img4];

      imagesPath.forEach(mov => {
        const imagePath = mov.split('/')[4];

        return deleteFile(`images/${imagePath}`);
      });

      return res.json({ message: 'Deleted' });
    })
    .catch(err => {
      next(new Error(err));
    });
};
