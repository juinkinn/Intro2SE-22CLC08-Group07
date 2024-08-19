const express = require('express');
const router = express.Router();
const path = require('path');

// Define your routes to serve HTML files
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/main.html'));
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/main.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/profile.html'));
});

router.get('/logout', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/logout.html'));
});

module.exports = router;
