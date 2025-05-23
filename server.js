const express = require('express');
const path = require('node:path');
const { getAllThreads, getAllThreadIds, getThreadById, getThreadsbyCategory, createThread } = require('./public/js/threads.js');

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

app.get('/api/threadsbycategory', (req, res) => {
  getAllThreads((err, threads) => {
    if (err) {
      res.status(500).json({ error: 'Erreur lors de la récupération des threads par categorie' });
    } else {
      res.json(threads);
    }
  });
});

app.post('/api/create-thread', (req, res) => {
  const { title, category, description } = req.body;
  console.log("Requête reçue avec :", { title, category, description }); 

  createThread(title, category, description, (err, result) => {
    if (err) {
      console.error("Erreur lors de la création du thread :", err); 
      return res.status(500).json({ error: 'Erreur serveur lors de la création du thread' });
    }
    console.log("Thread créé avec ID :", result.id); 
    res.json({ success: true, id: result.id });
  });
});


app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
