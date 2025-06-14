const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("forum.db", sqlite3.OPEN_READWRITE, err => {
  if (err) return console.error("Erreur connexion DB:", err.message);
  console.log("DB connectée");
});

function getAllThreads(cb) {
  db.all('SELECT * FROM threads ORDER BY Likes DESC', [], cb);
}

function getAllThreadIds(cb) {
  db.all('SELECT ID FROM Threads', [], cb);
}

function getThreadById(id, cb) {
  db.get('SELECT * FROM threads WHERE Id = ?', [id], (err, row) => {
    if (err) return cb(err);
    if (!row) return cb(null, null);
    cb(null, {
      id: row.id,
      Title: row.Title,
      Category: row.Category,
      Description: row.Description,
      Date: row.Date,
      Likes: row.Likes,
      Dislikes: row.Dislikes
    });
  });
}

function getThreadsbyCategory(category, callback) {
    const query = 'SELECT * FROM threads WHERE Category = ? ORDER BY Id DESC';
    db.all(query, [category], (err, threads) => {
        if (err) {
            console.error('Database error:', err);
            return callback(err);
        }
        callback(null, threads);
    });
}

function getAllThreadsbySort(sort) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM threads ORDER BY ' + (sort === 'Date' ? 'Date DESC' : 'Likes DESC');
        db.all(query, [], (err, threads) => {
            if (err) reject(err);
            else resolve(threads);
        });
    });
}

function createThread(title, category, description, cb) {
  const q = 'INSERT INTO Threads (Title, Category, Description, Date, Likes, Dislikes) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(q, [title, category, description,  new Date(),0, 0], function (err) {
    if (err) return cb(err);
    cb(null, { id: this.lastID });
  });
}

module.exports = {
  getAllThreads,
  getAllThreadIds,
  getThreadById,
  getThreadsbyCategory,
  getAllThreadsbySort,
  createThread
};
