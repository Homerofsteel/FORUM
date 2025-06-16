const express = require('express');
const db = require('../database.js');

const router = express.Router();

router.post('/api/comments', (req, res) => {
  const { thread_id, user_id, content, parent_id } = req.body;

  console.log("Comment POST reçu : ", { thread_id, user_id, content, parent_id });

  if (!thread_id || !user_id || !content) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  const query = `
    INSERT INTO comments (thread_id, user_id, content, parent_id)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [thread_id, user_id, content, parent_id || null], function (err) {
    if (err) {
      console.error("Erreur SQL:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, id: this.lastID });
  });
});

router.get('/api/comments/:thread_id', (req, res) => {
  const threadId = req.params.thread_id;

  const query = `
    SELECT c.*, u.username
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.thread_id = ?
    ORDER BY c.created_at ASC
  `;
  db.all(query, [threadId], (err, rows) => {
    if (err) {
      console.error("Erreur récupération commentaires:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("Commentaires récupérés pour thread", threadId, ":", rows);
res.json(rows);

  });
});

module.exports = router;
