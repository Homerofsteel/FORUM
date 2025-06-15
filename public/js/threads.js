const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("forum.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Erreur lors de la connexion à la base de données :", err.message);
  } else {
    console.log("Connexion réussie à la base de données.");
  }
});

function getAllThreads(callback) {
  db.all("SELECT * FROM threads ORDER BY Likes DESC", [], callback);
}

function getAllThreadIds(callback) {
  db.all("SELECT ID FROM threads", [], callback);
}

function getThreadById(id, callback) {
  db.get("SELECT * FROM threads WHERE ID = ?", [id], (err, row) => {
    if (err) return callback(err);
    callback(null, row || null); 
  });
}

function getFilteredThreads(category, sort, callback) {
  const tri = sort === "Date" ? "Date DESC" : "Likes DESC";
  let query = "SELECT * FROM threads";
  const params = [];

  if (category && category !== "all") {
    query += " WHERE Category = ?";
    params.push(category);
  }

  query += ` ORDER BY ${tri}`;
  db.all(query, params, callback);
}

function createThread(title, category, description, callback) {
  const now = new Date();
  const query = `
    INSERT INTO threads (Title, Category, Description, Date, Likes, Dislikes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(query, [title, category, description, now, 0, 0], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID }); 
  });
}

function updateVote(threadId, action, callback) {
  let query;

  switch (action) {
    case "like":
      query = "UPDATE threads SET Likes = Likes + 1 WHERE ID = ?";
      break;
    case "dislike":
      query = "UPDATE threads SET Dislikes = Dislikes + 1 WHERE ID = ?";
      break;
    case "remove-like":
      query = "UPDATE threads SET Likes = MAX(Likes - 1, 0) WHERE ID = ?";
      break;
    case "remove-dislike":
      query = "UPDATE threads SET Dislikes = MAX(Dislikes - 1, 0) WHERE ID = ?";
      break;
    case "switch-to-like":
      query = "UPDATE threads SET Likes = Likes + 1, Dislikes = MAX(Dislikes - 1, 0) WHERE ID = ?";
      break;
    case "switch-to-dislike":
      query = "UPDATE threads SET Dislikes = Dislikes + 1, Likes = MAX(Likes - 1, 0) WHERE ID = ?";
      break;
    default:
      return callback(new Error("Action non reconnue"));
  }

  db.run(query, [threadId], function (err) {
    if (err) return callback(err);
    db.get("SELECT Likes, Dislikes FROM threads WHERE ID = ?", [threadId], callback);
  });
}

module.exports = {
  getAllThreads,
  getAllThreadIds,
  getThreadById,
  getFilteredThreads,
  createThread,
  updateVote
};
