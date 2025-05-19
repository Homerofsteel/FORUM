const sqlite3 = require('sqlite3').verbose();

function connectToDatabase() {
  return new sqlite3.Database("forum.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error("Erreur lors de la connexion à la base de données:", err.message);
      return null;
    }
    console.log("Connexion à la base de données réussie");
  });
}

function getAllThreads(callback) {
  const db = connectToDatabase();
  db.all("SELECT Title, Category FROM Threads ORDER BY [Upvotes-Number] DESC", [], (err, rows) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête:", err.message);
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
  db.close();
}

function getAllThreadIds(callback) {
  const db = connectToDatabase();
  db.all("SELECT ID FROM Threads", [], (err, rows) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête:", err.message);
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
  db.close();
}

function getThreadById(id, callback) {
  const db = connectToDatabase();
  db.all("SELECT * FROM Threads WHERE ID = ?", [id], (err, rows) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête:", err.message);
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
  db.close();
}

function sortThreadsbyCategory(category, callback) {
  const db = connectToDatabase();
  db.all("SELECT * FROM Threads WHERE category = ?", [category], (err, rows) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête:", err.message);
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
  db.close();
}

export { getAllThreads, getAllThreadIds, getThreadById, sortThreadsbyCategory };