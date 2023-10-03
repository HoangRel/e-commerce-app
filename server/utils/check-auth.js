const checkAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.json({ isLoggedIn: false });
  }

  const userName = req.session.user.name;
  const role = req.session.user.role;
  return res.json({ isLoggedIn: true, name: userName, role });
};

module.exports = checkAuth;
