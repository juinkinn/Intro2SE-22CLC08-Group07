const express = require('express');
const router = express.Router();
const db = require('../db');

// Register a doctor
router.post('/api/register-doctor', (req, res) => {
    const { doctorName, specialization, doctorDescription } = req.body;

    // Basic validation
    if (!doctorName || !specialization) {
        return res.status(400).json({ message: 'Doctor name and specialization are required.' });
    }

    const query = 'INSERT INTO doctors (doctor_name, specialization, description) VALUES (?, ?, ?)';
    db.query(query, [doctorName, specialization, doctorDescription], (err, results) => {
        if (err) {
            console.error('Error inserting doctor details:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Doctor registered successfully!' });
    });
});

module.exports = router;
