const { getUserByApiKey } = require("../models/userModel");

module.exports = async function (req, res, next) {
  const key = req.cookies.session;

  if (!key) return next();

  const user = await getUserByApiKey(key);

  if (!user) return next();

  // já logado → redireciona
  if (user.role === "admin") {
    return res.redirect("/admin");
  }

  return res.redirect("/dashboard");
};