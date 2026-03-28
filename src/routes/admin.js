const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const { getDB } = require("../db/database")
const { getUserById } = require("../models/userModel")

const {
  getAllUsers,
  searchUsers,
  createUser,
  deleteUser
} = require("../models/userModel");

// 🔒 só admin
router.use(requireAuth, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Acesso negado");
  }
  next();
});

// 📄 listar + buscar
router.get("/", async (req, res) => {
  const { q, tab } = req.query;
  const db = getDB();

  let users = [];

  if (tab === "search" && q) {
    users = await searchUsers(q);
  }

  // 📊 STATS
  const totalUsers = await db.get("SELECT COUNT(*) as count FROM users");
  const totalAdmins = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
  const totalRequests = await db.get("SELECT SUM(usage_count) as total FROM users");

  const avgUsage = totalUsers.count
    ? Math.round((totalRequests.total || 0) / totalUsers.count)
    : 0;

  res.render("admin", {
    user: req.user,
    users,
    selectedUser: null,
    query: req.query,
    stats: {
      totalUsers: totalUsers.count,
      totalAdmins: totalAdmins.count,
      totalRequests: totalRequests.total || 0,
      avgUsage
    }
  });
});

// ➕ criar usuário
router.post("/create", async (req, res) => {
  const { username, password, role, rate_limit, force_reset} = req.body;

  if (!username || !password) {
    return res.redirect("/admin");
  }

  await createUser({ username, password, role, rate_limit, force_reset });

  res.redirect("/admin");
});

// ❌ deletar
router.post("/delete/:id", async (req, res) => {
  await deleteUser(req.params.id);
  res.redirect("/admin");
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).send("Usuário não encontrado");
    }

    res.render("admin", {
      user: req.user,
      users: [],
      stats: {},
      query: { tab: "search" },
      selectedUser: user
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro");
  }
});

router.post("/user/:id", async (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { rate_limit, role, reset_usage } = req.body;

  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).send("Usuário não encontrado");

    let updates = [];
    let values = [];

    if (rate_limit) {
      updates.push("rate_limit = ?");
      values.push(rate_limit);
    }

    if (role) {
      updates.push("role = ?");
      values.push(role);
    }

    if (reset_usage === "true") {
      updates.push("usage_count = 0");
      updates.push("usage_reset = CURRENT_TIMESTAMP");
    }

    if (updates.length > 0) {
      values.push(id);

      await db.run(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        values
      );
    }

    res.redirect(`/admin/user/${id}?tab=search`);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar usuário");
  }
});

module.exports = router;