// statisticsRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', (req, res) => {
  pool.query('SELECT id_appointment, patient_name, patient_email, patient_phone, day_to_meet, time_to_meet, status FROM appointments', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

router.get('/comments', (req, res) => {
  pool.query('SELECT id, post_id, content, author_id, role FROM comments', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

router.get('/doctors', (req, res) => {
  pool.query('SELECT id_doctor, doctor_name, specialization FROM doctors', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

router.get('/patients', (req, res) => {
  pool.query('SELECT id_patient, patient_name, patient_age FROM patients', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

router.get('/posts', (req, res) => {
  pool.query('SELECT id, content, author_id, role FROM posts', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

router.get('/users', (req, res) => {
  pool.query('SELECT id, name, email, role FROM users', (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

router.get('/countStatistics', async (req, res) => {
    try {
        const results = await Promise.all([
            pool.query('SELECT COUNT(*) AS count FROM users'),
            pool.query('SELECT COUNT(*) AS count FROM doctors'),
            pool.query('SELECT COUNT(*) AS count FROM patients'),
            pool.query('SELECT COUNT(*) AS count FROM posts'),
            pool.query('SELECT COUNT(*) AS count FROM comments'),
        ]);

        const userCount = results[0][0].count;
        const doctorCount = results[1][0].count;
        const patientCount = results[2][0].count;
        const postCount = results[3][0].count;
        const commentCount = results[4][0].count;

        res.json({
            userCount,
            doctorCount,
            patientCount,
            postCount,
            commentCount,
        });
    } catch (error) {
        console.error('Error fetching counts:', error);
        res.status(500).json({ error: 'Error fetching counts' });
    }
});

module.exports = router;
