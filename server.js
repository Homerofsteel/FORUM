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
const SignUp = require('./SignUp.js');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
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
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/public/html/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

app.get('/public/html/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'signup.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'home.html'));
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

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt for:', username);

    try {
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username and password are required' 
            });
        }

        const user = await Auth.findUserInDatabase(username, password);
        console.log('Auth result:', user ? 'User found' : 'User not found');

        if (user) {
            const token = jwt.sign(
                { userId: user.Id, Username: user.Username },
                SECRET_KEY,
                { expiresIn: '24h' }
            );

            res.cookie('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000
            });

            console.log('Login successful for:', username);
            res.json({ 
                success: true, 
                token,
                user: {
                    id: user.Id,
                    Username: user.Username
                }
            });
        } else {
            console.log('Login failed for:', username);
            res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred during login' 
        });
    }
});

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await SignUp.createUser(username, password, email);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Middleware routes pour protections 
const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Application des routes protégées
app.post('/api/create-thread', authenticateToken, (req, res) => {
  const { title, category, description } = req.body;
  createThread(title, category, description, (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur création thread' });
     console.error('Erreur SQL:', err);
    res.json({ success: true, id: result.Id });
  });
});

app.post('/api/thread/:id/vote', authenticateToken, (req, res) => {
  const threadId = req.params.Id;
  const { action } = req.body;

  updateVote(threadId, action, (err, updated) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
    res.json({ success: true, likes: updated.Likes, dislikes: updated.Dislikes });
  });
});

// md pro routes
app.use('/api/create-thread', authenticateToken);
app.use('/api/thread/:id/vote', authenticateToken);

// deco authentification
app.post('/api/logout', (req, res) => {
    res.clearCookie('authToken');
    res.json({ success: true });
});
// F5 Tokens
app.post('/api/refresh-token', authenticateToken, (req, res) => {
    const token = jwt.sign(
        { userId: req.users.Id, username: req.users.Username },
        SECRET_KEY,
        { expiresIn: '24h' }
    );
    res.json({ success: true, token });
});

app.get('/api/thread/:id/comments', async (req, res) => {
    const threadId = req.params.id;
    
    const query = `
        SELECT c.*, u.Username as username 
        FROM comments c
        JOIN users u ON c.user_id = u.id 
        WHERE c.thread_id = ? 
        ORDER BY c.created_at DESC
    `;
    
    db.all(query, [threadId], (err, comments) => {
        if (err) {
            console.error('Error fetching comments:', err);
            return res.status(500).json({ success: false, error: 'Error fetching comments' });
        }
        res.json({ success: true, comments });
    });
});

app.post('/api/thread/:id/comment', authenticateToken, (req, res) => {
    const { content } = req.body;
    const threadId = req.params.id;
    const userId = req.user.userId;

    db.run('INSERT INTO comments (thread_id, user_id, content, created_at) VALUES (?, ?, ?, datetime("now"))', 
        [threadId, userId, content], 
        function(err) {
            if (err) {
                console.error('Error creating comment:', err);
                return res.status(500).json({ success: false, error: 'Error creating comment' });
            }
            res.json({ success: true, commentId: this.lastID });
        });
});

app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});