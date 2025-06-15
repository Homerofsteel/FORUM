// routes/report.js
const express = require('express');
const router = express.Router();
const db = require('../database'); // ✅ bon chemin

// ✅ POST - ajouter un signalement
router.post('/api/report', (req, res) => {
  const { type, reported_id, reason, user_id } = req.body;

  if (!type || !reported_id || !reason) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const query = `INSERT INTO reports (type, reported_id, reason, user_id) VALUES (?, ?, ?, ?)`;
  db.run(query, [type, reported_id, reason, user_id || null], function (err) {
    if (err) {
      console.error('Erreur INSERT report:', err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json({ success: true, id: this.lastID });
  });
});

// ✅ GET - récupérer tous les signalements
router.get('/api/reports', (req, res) => {
  const query = `SELECT * FROM reports ORDER BY created_at DESC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erreur SELECT reports:', err.message);
      return res.status(500).json({ error: 'Erreur récupération des signalements' });
    }

    res.json({ success: true, reports: rows });
  });
});

module.exports = router;
