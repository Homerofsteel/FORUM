import sqlite3 from "sqlite3";

const db = new sqlite3.Database("forum.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Erreur lors de la connexion à la base de données:", err.message);
    return;
  }
  console.log("Connexion à la base de données réussie");


    db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      ["bob", "bob@mail.com", "1234"],
      function (err) {
        if (err) {
          console.error("Erreur INSERT:", err.message);
          return;
        }
        console.log(`Utilisateur inséré avec ID ${this.lastID}`);

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