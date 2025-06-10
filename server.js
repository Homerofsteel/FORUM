const express = require('express');
const path = require('node:path');
const { getAllThreads, getAllThreadIds, getThreadById, getThreadsbyCategory } = require('./public/js/select_threads.js');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'home.html'));
});

app.get('/api/threads', (req, res) => {
  getAllThreads((err, threads) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des threads' });
    } else {
      res.json(threads);
    }
  });
});

app.get('/api/threadsids', (req, res) => {
  getAllThreadIds((err, ids) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des IDs' });
    } else {
      res.json(ids);
    }
  });
});

app.post('/api/report', (req, res) => {
  const { userId, postId, reason } = req.body;

  const query = `INSERT INTO reports (user_id, post_id, reason) VALUES (?, ?, ?)`;
  db.run(query, [userId, postId, reason], function(err) {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la création du signalement' });
    } else {
      res.status(200).json({ message: 'Signalement créé avec succès', reportId: this.lastID });
    }
  });
});


app.get('/api/threadsbycategory', (req, res) => {
  getAllThreads((err, threads) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des threads par categorie' });
    } else {
      res.json(threads);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
