const express = require('express');
const router = express.Router();
const db = require('../db');
// POST /api/rate
router.post('/', async (req, res) => {
    const { name, stars, comment } = req.body;
    try {
        await db.insertRating(name, stars, comment);
        res.send('Thank you for your feedback!');
    } catch (err) {
        console.error('Error inserting rating:', err);
        res.status(500).send('An error occurred while saving your feedback.');
    }
});

// GET /api/rate
router.get('/', async (req, res) => {
    try {
        const results = await db.getAllRatings();
        res.json(results);
    } catch (err) {
        console.error('Error fetching ratings:', err);
        res.status(500).send('An error occurred while fetching ratings.');
    }
});

module.exports = router;