const User = require('../models/user');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

module.exports.postSignUp = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.status(401).json({
      message: 'Không thể tạo acc mới khi đang trong trạng thái đăng nhập!',
    });
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const phone = req.body.phone;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const msg = errors.array();
    const resMsg = msg.map(mov => {
      return { path: mov.path, msg: mov.msg };
    });

    return res.status(422).json(resMsg);
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({ name, email, password: hashedPassword, phone });
      return user.save();
    })
    .then(result => {
      res.json({ message: 'Account Created!' });
    })
    .catch(err => {
      return next(new Error(err));
    });
};

module.exports.postLogin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.status(401).json({
      message: 'Không thể đăng nhập khi đang trong trạng thái đăng nhập!',
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const msg = errors.array();
    const resMsg = msg.map(mov => {
      return { path: mov.path, msg: mov.msg };
    });

    return res.status(422).json(resMsg);
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        const resMsg = [{ path: 'email', msg: 'Email does not exist' }];
        return res.status(422).json(resMsg);
      }

      return bcrypt.compare(password, user.password).then(doMatch => {
        if (!doMatch) {
          const resMsg = [{ path: 'password', msg: 'Invalid password value' }];
          return res.status(422).json(resMsg);
        }

        req.session.isLoggedIn = true;
        req.session.user = user;

        return req.session.save(err => {
          if (!err) {
            return res.json({ message: 'Logged in successfully' });
          }
        });
      });
    })
    .catch(err => {
      return next(new Error(err));
    });
};

module.exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      return next(new Error(err));
    }
    return res.json({ message: 'logged out!' });
  });
};
