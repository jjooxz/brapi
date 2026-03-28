const { getDB } = require("../db/database.js");
const crypto = require("crypto");
const bcrypt = require("bcrypt")

async function getAllUsers() {
  const db = getDB();
  return await db.all("SELECT * FROM users ORDER BY created_at DESC");
}

async function searchUsers(query) {
  const db = getDB();
  return await db.all(
    "SELECT * FROM users WHERE username LIKE ?",
    [`%${query}%`]
  );
}

async function getUserById(id) {
  const db = getDB();
  return await db.get(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
}


// ➕ criar usuário
async function createUser({ username, password, role = "user", rate_limt = 100, force_password = true }) {
  const db = getDB();

  const hashed = await bcrypt.hash(password, 10);
  const apiKey = "KEY_" + Math.random().toString(36).slice(2);

  return await db.run(
    `INSERT INTO users (username, password, role, api_key, rate_limit, force_password)
     VALUES (?, ?, ?, ?, ?)`,
    [username, hashed, role, apiKey, rate_limit, force_password]
  );
}

async function deleteUser(id) {
  const db = getDB();
  return await db.run(
    "DELETE FROM users WHERE id = ?",
    [id]
  );
}


async function getUserByApiKey(apiKey) {
  return getDB().get(
    "SELECT * FROM users WHERE api_key = ?",
    [apiKey]
  );
}

module.exports = {
  getAllUsers,
  searchUsers,
  getUserById,
  createUser,
  deleteUser,
  getUserByApiKey
};