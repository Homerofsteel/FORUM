const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("forum.db", sqlite3.OPEN_READWRITE, err => {
  if (err) return console.error("Erreur connexion DB:", err.message);
  console.log("DB connectée");
});

const getAllThreads = cb => {
  db.all('SELECT * FROM threads ORDER BY Likes DESC', [], cb);
};

const getAllThreadIds = cb => {
  db.all('SELECT ID FROM Threads', [], cb);
};

const getThreadById = (id, cb) => {
  db.get('SELECT * FROM threads WHERE Id = ?', [id], (err, row) => {
    if (err) return cb(err);
    cb(null, row || null);
  });
};


const getFilteredThreads = (category, sort, cb) => {
  const order = sort === 'Date' ? 'Date DESC' : 'Likes DESC';
  let query = 'SELECT * FROM threads';
  const params = [];

  if (category && category !== 'all') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ` ORDER BY ${order}`;

  db.all(query, params, cb);
};

const createThread = (title, category, description, cb) => {
  const query = `INSERT INTO Threads (Title, Category, Description, Date, Likes, Dislikes)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  const now = new Date();
  db.run(query, [title, category, description, now, 0, 0], function (err) {
    if (err) return cb(err);
    cb(null, { id: this.lastID });
  });
};

module.exports = {
  getAllThreads,
  getAllThreadIds,
  getThreadById,
  getFilteredThreads,
  createThread
};
