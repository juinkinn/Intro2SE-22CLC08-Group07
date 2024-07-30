const express = require('express');
const router = express.Router();
const db = require('../db');

// Register a patient and fetch doctors with the same specialization
router.post('/api/register-patient', (req, res) => {
    const { patientName, patientAge, patientDescription, specializationNeeded } = req.body;

    if (!patientName || !patientAge || !patientDescription || !specializationNeeded) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const patientQuery = 'INSERT INTO patients (patient_name, patient_age, patient_description, specialization_needed) VALUES (?, ?, ?, ?)';
    db.query(patientQuery, [patientName, patientAge, patientDescription, specializationNeeded], (err, patientResult) => {
        if (err) {
            console.error('Error inserting patient details:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const doctorQuery = 'SELECT doctor_name, specialization, description FROM doctors WHERE specialization = ?';
        db.query(doctorQuery, [specializationNeeded], (err, doctors) => {
            if (err) {
                console.error('Error fetching doctors:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(200).json({ message: 'Patient registered successfully!', doctors });
        });
    });
});

// Fetch available doctors with descriptions
router.get('/api/available-doctors', (req, res) => {
    const query = 'SELECT doctor_name, specialization, description FROM doctors';
    db.query(query, (err, doctors) => {
        if (err) {
            console.error('Error fetching doctors:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        res.status(200).json({ doctors });
    });
});

// Schedule an appointment
router.post('/api/schedule-appointment', (req, res) => {
    const { dateTime, doctorId, patientId, status } = req.body;

    if (!dateTime || !doctorId || !patientId) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const appointmentQuery = 'INSERT INTO appointments (day_to_meet, id_doctor, id_patient, status) VALUES (?, ?, ?, ?)';
    db.query(appointmentQuery, [dateTime, doctorId, patientId, status || 'pending'], (err, result) => {
        if (err) {
            console.error('Error scheduling appointment:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ message: 'Appointment requested successfully!' });
    });
});

module.exports = router;
