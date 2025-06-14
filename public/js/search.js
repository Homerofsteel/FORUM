const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('node:path');

// Chemin vers la base SQLite
const dbPath = path.resolve(__dirname, '../db/forum.db');
const db = new sqlite3.Database(dbPath);

router.get('/', (req, res) => {
    const q = req.query.q || '';
    const sql = `SELECT * FROM threads WHERE title LIKE ?`;

    db.all(sql, [`%${q}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }
        res.json(rows);
    });
});

module.exports = router;
