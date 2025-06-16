// database.js
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("forum.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Erreur lors de la connexion à la base de données:", err.message);
    return;
  }
  console.log("Connexion à la base de données réussie");

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error("Erreur CREATE users:", err.message);
      return;
    }
    console.log("Table users prête.");
  });

  db.run(`CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    post_id INTEGER,
    reason TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(post_id) REFERENCES posts(id)
  )`, (err) => {
    if (err) {
      console.error("Erreur CREATE reports:", err.message);
      return;
    }
    console.log("Table reports prête.");
  });

  db.run(`CREATE TABLE IF NOT EXISTS comments (
    thread_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    parent_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (thread_id) REFERENCES threads(ID),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES comments(rowid)
  )`, err => {
    if (err) console.error("Error creating comments table:", err.message);
    else console.log("Comments table ready");
  });
});

export default db;
