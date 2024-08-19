// specializations.js
const express = require('express');
const router = express.Router();

router.get('/api/specializations', (req, res) => {
    const db = req.db; // Using the db connection from app.js

    const query = 'SELECT * FROM specializations';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching specializations:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(200).json({ specializations: results });
        }
    });
});

module.exports = router;
