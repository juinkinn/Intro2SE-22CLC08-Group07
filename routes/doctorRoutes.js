const express = require('express');
const router = express.Router();
const db = require('../db');

// Register a doctor
router.post('/api/register-doctor', async (req, res) => {
    const { doctorName, specialization, doctorDescription, userId } = req.body; // Get userId from the request

    if (!doctorName || !specialization || !doctorDescription || !userId) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const insertQuery = 'INSERT INTO doctors (doctor_name, specialization, description, userId) VALUES (?, ?, ?, ?)';

    try {
        const result = await new Promise((resolve, reject) => {
            db.query(insertQuery, [doctorName, specialization, doctorDescription, userId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
        const doctorId = result.insertId;
        res.status(200).json({ message: 'Doctor registered successfully!', doctorId });
    } catch (err) {
        console.error('Error inserting doctor details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Fetch pending appointments for a doctor
router.get('/api/manage-appointments', async (req, res) => {
    const { doctorId } = req.query;

    if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required.' });
    }

    const query = `SELECT a.*
                   FROM appointments a 
                   WHERE a.id_doctor = ? AND a.status = "pending"`;

    try {
        const appointments = await db.query(query, [doctorId]);
        res.status(200).json({ appointments });
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Accept or decline appointment
router.put('/api/manage-appointments/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;
    const { action } = req.body;

    if (!action || (action !== 'accept' && action !== 'decline')) {
        return res.status(400).json({ error: 'Invalid action.' });
    }

    let status = '';
    if (action === 'accept') {
        status = 'accepted';
    } else if (action === 'decline') {
        status = 'declined';
    }

    const query = 'UPDATE appointments SET status = ? WHERE id_appointment = ?';

    try {
        await db.query(query, [status, appointmentId]);
        res.status(200).json({ message: `Appointment ${status} successfully!` });
    } catch (err) {
        console.error('Error updating appointment status:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

