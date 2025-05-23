const express = require('express');
const path = require('node:path');
const { getAllThreads, getAllThreadIds, getThreadById, getThreadsbyCategory } = require('./public/js/select_threads.js');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

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
