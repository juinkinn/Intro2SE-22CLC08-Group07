const express = require("express");
const authController = require("../controllers/auth.js");
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Profile route
router.get('/profile', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.sendFile(path.join(__dirname, '../public/profile.html'));
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
