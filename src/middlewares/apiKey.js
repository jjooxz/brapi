const { getUserByApiKey } = require("../models/userModel");
const { getDB } = require("../db/database"); // ou teu getDB()

async function apiKeyMiddleware(req, res, next) {
  const db = getDB();
  const key = req.headers["x-api-key"] || req.cookies?.session;

  if (!key) return res.status(401).json({ error: "No API key" });

  const user = await getUserByApiKey(key);

  if (!user) return res.status(403).json({ error: "Invalid API key" });

  // 🧠 RESET A CADA HORA
  const now = Date.now();
  const lastReset = user.usage_reset
    ? new Date(user.usage_reset).getTime()
    : 0;

  if (now - lastReset > 1000 * 60 * 60) {
    await db.run(
      "UPDATE users SET usage_count = 0, usage_reset = CURRENT_TIMESTAMP WHERE id = ?",
      [user.id]
    );

    user.usage_count = 0;
  }

  // 🚀 INCREMENTA USO
  await db.run(
    "UPDATE users SET usage_count = usage_count + 1 WHERE id = ?",
    [user.id]
  );

  if (user.force_password_reset) {
    return res.status(403).json({
      error: "You must reset your password first"
    });
  }

  // ❌ RATE LIMIT
  if (user.usage_count > user.rate_limit) {
    return res.status(429).json({
      error: "Rate limit exceeded"
    });
  }

  user.usage_count++;

  req.user = user;
  next();
}

module.exports = apiKeyMiddleware;