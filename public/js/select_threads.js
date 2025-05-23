const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("forum.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Erreur lors de la connexion à la base de données:", err.message);
    return;
  }
  console.log("Connexion à la base de données réussie");
});

// Récupère tous les threads
function getAllThreads(callback) {
  db.all("SELECT Title, Category FROM Threads ORDER BY [Upvotes-Number] DESC", [], (err, rows) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête getAllThreads:", err.message);
      callback(err, null);
      return;
    }
    callback(null, rows);
    db.close();
  });
}


// Récupère tous les IDs des threads
function getAllThreadIds(callback) {
  db.all("SELECT ID FROM Threads", [], (err, rows) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête getAllThreadIds:", err.message);
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
}

// Récupère un thread par son ID
function getThreadById(id, callback) {
  db.all("SELECT * FROM Threads WHERE ID = ?", [id], (err, rows) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête getThreadById:", err.message);
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
}

// Trie les threads par catégorie
function getThreadsbyCategory(category, callback) {
  db.all("SELECT * FROM Threads WHERE category = ?", [category], (err, rows) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête sortThreadsbyCategory:", err.message);
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
}

module.exports = { getAllThreads, getAllThreadIds, getThreadById, getThreadsbyCategory };
