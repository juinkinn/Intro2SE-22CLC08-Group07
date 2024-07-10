const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// Serve the index.html file from the root directory
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log("MYSQL CONNECTED");
    }
});

// Make the database connection available to other modules
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Define Routes
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const pageRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');
const specializationRoutes = require('./routes/specializations');

app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use(specializationRoutes);
app.use(patientRoutes);
app.use(doctorRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = app;
