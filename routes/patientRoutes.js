const express = require('express');
const router = express.Router();
const db = require('../db');

// Register a patient
router.post('/api/register-patient', (req, res) => {
    const { patientName, patientAge, patientDescription, specializationNeeded } = req.body;

    // Basic validation
    if (!patientName || !patientAge) {
        return res.status(400).json({ message: 'Patient name and age are required.' });
    }

    const query = 'INSERT INTO patients (patient_name, patient_age, patient_description, specialization_needed) VALUES (?, ?, ?, ?)';
    db.query(query, [patientName, patientAge, patientDescription, specializationNeeded], (err, results) => {
        if (err) {
            console.error('Error inserting patient details:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Fetch doctors with the same specialization
        const doctorQuery = 'SELECT doctor_name, specialization FROM doctors WHERE specialization = ?';
        db.query(doctorQuery, [specializationNeeded], (err, doctors) => {
            if (err) {
                console.error('Error fetching doctors:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            res.status(200).json({ message: 'Patient registered successfully!', doctors });
        });
    });
});

module.exports = router;
