// In your routes file (e.g., routes/symptom.js)
const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust the path as needed

// POST route to search symptoms
router.post('/symptom', async (req, res) => {
    const { symptom } = req.body;

    try {
        const results = await db.searchSymptoms(symptom);
        res.json(results);
    } catch (error) {
        console.error('Error fetching symptoms:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
