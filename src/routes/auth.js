const express = require("express");
const bcrypt = require("bcrypt");
const { getDB } = require("../db/database");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({
            error: "Username and password required"
        });
    }

    let db = getDB();

    const user = await db.get(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

    if (!user) {
        return res.status(401).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        return res.status(401).json({ error: "Wrong password" });
    }

    res.cookie("session", user.api_key, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    });

    if (user.role === "admin") {
        return res.redirect("/admin");
    }

    return res.redirect("/dashboard");
});

router.post("/reset-password-inline", requireAuth, async (req, res) => {
  const db = getDB();
  const bcrypt = require("bcrypt");

  const { password } = req.body;

  if (!password || password.length < 4) {
    return res.redirect("/dashboard");
  }

  const hashed = await bcrypt.hash(password, 10);

  await db.run(
    `UPDATE users 
     SET password = ?, force_password_reset = 0 
     WHERE id = ?`,
    [hashed, req.user.id]
  );

  res.redirect("/dashboard");
});

router.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.clearCookie("temp_user"); // por garantia

  res.redirect("/login");
});

module.exports = router;