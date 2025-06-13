import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from './database.js';
import { setCookie, getCookie, clearCookie, cookieParser } from './utils/cookieManager.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'home.html'));
});

// Routes pour gérer les cookies
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

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
