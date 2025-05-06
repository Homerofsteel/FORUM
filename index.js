import sqlite3 from "sqlite3";

const db = new sqlite3.Database("forum.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Erreur lors de la connexion à la base de données:", err.message);
    return;
  }
  console.log("Connexion à la base de données réussie");
});

db.all("SELECT Username FROM users", [], (err, rows) => {
  if (err) {
    console.error("Erreur lors de l'exécution de la requête:", err.message);
    return;
  }
  console.log(rows);
});