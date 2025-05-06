import sqlite3 from "sqlite3";

// Connexion à la base
const db = new sqlite3.Database("forum.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Erreur lors de la connexion à la base de données:", err.message);
    return;
  }
  console.log("Connexion à la base de données réussie");

  // 1. Créer la table
  db.run(`DROP TABLE IF EXISTS users`);
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error("Erreur CREATE:", err.message);
      return;
    }
    console.log("Table users prête.");

    // 2. Insérer un utilisateur
    db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      ["bob", "bob@mail.com", "1234"],
      function (err) {
        if (err) {
          console.error("Erreur INSERT:", err.message);
          return;
        }
        console.log(`Utilisateur inséré avec ID ${this.lastID}`);

        // 3. Lister les utilisateurs après insertion
        db.all("SELECT username FROM users", [], (err, rows) => {
          if (err) {
            console.error("Erreur SELECT:", err.message);
            return;
          }
          console.log("Utilisateurs :");
          console.log(rows);
        });
      });
  });
});
