const express = require('express');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./forum.db'); 

const { setCookie, getCookie, clearCookie, cookieParser }  = require ('./public/js/cookieManager.js');
const {
  getAllThreads,
  getAllThreadIds,
  getThreadById,
  getFilteredThreads,
  createThread
} = require('./public/js/threads.js');

const fileURLToPath = require('node:url');

const app = express();
const PORT = 3000;


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'html', 'home.html'))
);



app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

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

app.get('/api/threads/filter', (req, res) => {
  const sort = req.query.sort || 'Date';
  const category = req.query.category || 'all';

  getFilteredThreads(category, sort, (err, threads) => {
    if (err) return res.status(500).json({ error: 'Erreur récupération threads' });
    res.json(threads);
  });
});

app.post('/api/create-thread', (req, res) => {
  const { title, category, description } = req.body;
  createThread(title, category, description, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur création thread' });
     console.error('Erreur SQL:', err);
    res.json({ success: true, id: result.id });
  });
});



app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});