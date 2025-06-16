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
  createThread,
  updateVote
} = require('./public/js/threads.js');

const fileURLToPath = require('node:url');

const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Auth = require('./Auth.js');

const SECRET_KEY = 'your-secret-key';

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// temp route
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/html/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/html/signup.html');
});

// temp deep routes
app.get('/home', Auth.verifyToken, (req, res) => {
    res.sendFile(__dirname + '/public/html/home.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html');
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

app.post('/api/thread/:id/vote', (req, res) => {
  const threadId = req.params.id;
  const { action } = req.body;

  updateVote(threadId, action, (err, updated) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
    res.json({ success: true, likes: updated.Likes, dislikes: updated.Dislikes });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});