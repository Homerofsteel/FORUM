// database.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("forum.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Erreur lors de la connexion à la base de données:", err.message);
    return;
  }
  console.log("✅ Connexion à la base de données réussie");

  // Table users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("❌ Erreur CREATE users:", err.message);
    } else {
      console.log("✅ Table users prête.");
    }
  });

  // Table comments
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thread_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      parent_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (thread_id) REFERENCES threads(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (parent_id) REFERENCES comments(id)
    )
  `, (err) => {
    if (err) {
      console.error("❌ Erreur CREATE comments:", err.message);
    } else {
      console.log("✅ Table comments prête.");
    }
  });

  // Table reports (signalements)
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,             -- 'user' | 'comment' | 'thread'
      reported_id INTEGER NOT NULL,   -- id ciblé
      reason TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("❌ Erreur CREATE reports:", err.message);
    } else {
      console.log("✅ Table reports prête.");
    }
  });
});

module.exports = db;
