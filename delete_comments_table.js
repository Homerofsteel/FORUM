const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("forum.db");

db.run("DROP TABLE IF EXISTS comments", (err) => {
  if (err) {
    console.error("❌ Erreur lors de la suppression :", err.message);
  } else {
    console.log("✅ Table 'comments' supprimée avec succès.");
  }
  db.close();
});
