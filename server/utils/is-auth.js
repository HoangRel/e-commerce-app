exports.isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    console.log('isAuth failed');
    return res.status(422).json({ message: 'Yêu cần đăng nhập!' });
  }
  next();
};

exports.isTVVorAD = (req, res, next) => {
  if (req.user.role !== 'TVV' && req.user.role !== 'ADMIN') {
    console.log('isTVV or AD failed');
    return res.status(422).json({ message: 'not TVV!' });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    console.log('isAdmin failed');
    return res.status(422).json({ message: 'not Admin!' });
  }

  next();
};
