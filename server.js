// server.js
const express = require('express');
const path = require('node:path');
const cookieParser = require('cookie-parser'); // nécessaire ici

const { setCookie, getCookie, clearCookie } = require('./utils/cookieManager.js');
const {
  getAllThreads,
  getAllThreadIds,
  getThreadById,
  getThreadsbyCategory,
  createThread
} = require('./public/js/threads.js');

const commentRoutes = require('./routes/comment.js');

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.use(commentRoutes);

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'html', 'home.html'))
);

app.get('/set-cookie', (req, res) => {
  setCookie(res, 'username', 'bob', { maxAge: 900000, httpOnly: true });
  res.send('Cookie défini');
});
app.get('/get-cookie', (req, res) => {
  const username = getCookie(req, 'username');
  res.send(`Nom d'utilisateur du cookie : ${username}`);
});
app.get('/clear-cookie', (req, res) => {
  clearCookie(res, 'username');
  res.send('Cookie supprimé');
});

app.get('/api/threads', (req, res) => {
  getAllThreads((err, threads) => {
    if (err) return res.status(500).json({ success: false, error: 'Erreur récupération threads' });
    res.json(threads);
  });
});

app.get('/api/threadsids', (req, res) => {
  getAllThreadIds((err, ids) => {
    if (err) return res.status(500).json({ error: 'Erreur récupération IDs' });
    res.json(ids);
  });
});

app.get('/api/thread/:id', (req, res) => {
  const threadId = parseInt(req.params.id);
  if (isNaN(threadId)) return res.status(400).json({ success: false, error: 'ID invalide' });

  getThreadById(threadId, (err, thread) => {
    if (err) return res.status(500).json({ success: false, error: 'Erreur récupération thread' });
    if (!thread) return res.status(404).json({ success: false, error: 'Thread non trouvé' });
    res.json({ success: true, data: thread });
  });
});

app.get('/api/threadsbycategory/:category', (req, res) => {
  const category = req.params.category;

  if (!category) {
    return res.status(400).json({
      success: false,
      error: 'Catégorie requise'
    });
  }

  getThreadsbyCategory(category, (err, threads) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des threads'
      });
    }
    res.json(threads);
  });
});

app.post('/api/create-thread', (req, res) => {
  const { title, category, description } = req.body;
  createThread(title, category, description, (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur création thread' });
    }
    res.json({ success: true, id: result.id });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});
