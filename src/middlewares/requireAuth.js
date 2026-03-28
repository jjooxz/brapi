const { getUserByApiKey } = require("../models/userModel");

module.exports = async function (req, res, next) {
  const key = req.cookies.session;

  if (!key) return res.redirect("/login");

  const user = await getUserByApiKey(key);

  if (!user) return res.redirect("/login");

  req.user = user;
  next();
};