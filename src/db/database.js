const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");

let db;

// função de inicialização
async function initDB() {
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });

  // cria tabela
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      usage_count INTEGER DEFAULT 0,
      usage_reset DATETIME,
      api_key TEXT,
      rate_limit INTEGER DEFAULT 100,
      force_password_resett INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await createDefaultAdmin();

  return db;
}

// cria admin
async function createDefaultAdmin() {
  const admin = await db.get(
    "SELECT * FROM users WHERE username = ?",
    ["admin"]
  );

  if (!admin) {
    const hashedPassword = await bcrypt.hash("admin", 10);

    const apiKey = "ADMIN_KEY_" + Math.random().toString(36).substring(2);

    await db.run(
      `INSERT INTO users (username, password, role, api_key, rate_limit)
       VALUES (?, ?, ?, ?, ?)`,
      [
        "admin",
        hashedPassword,
        "admin",
        apiKey,
        1000
      ]
    );

    console.log("🔥 Admin criado: admin / admin");
  }
}

function getDB() {
    return db;
}

module.exports = { initDB, getDB };