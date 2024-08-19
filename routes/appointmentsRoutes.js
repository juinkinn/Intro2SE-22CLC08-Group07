const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch doctors by specialization
router.get('/api/doctors', async (req, res) => {
    const { specialization } = req.query;
    try {
        const doctors = await db.getDoctorsBySpecialization(specialization);
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching doctors' });
    }
});

// Create an appointment
router.post('/api/appointments', async (req, res) => {
    const { doctorId, patientName, patientEmail, patientPhone, appointmentDate, appointmentTime, userId } = req.body;
    if (!doctorId || !patientName || !patientEmail || !patientPhone || !appointmentDate || !appointmentTime || !userId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const appointment = await db.createAppointment(doctorId, userId, patientName, patientEmail, patientPhone, appointmentDate, appointmentTime);
        res.status(201).json(appointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Error creating appointment' });
    }
});

// Get all appointments for a doctor
router.get('/api/appointments', async (req, res) => {
    const { doctorId } = req.query;

    try {
        const appointments = await db.getAppointmentsByDoctor(doctorId);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching appointments' });
    }
});

// Update appointment status
router.put('/api/appointments/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;
    const { status } = req.body;

    try {
        await db.updateAppointmentStatus(appointmentId, status);
        res.status(200).json({ message: 'Appointment status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating appointment status' });
    }
});

module.exports = router;
