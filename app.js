const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepageview.html'));
});
// Middleware
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// Serve the index.html file from the root directory


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

// Function to execute SQL queries
const executeSqlQuery = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Read and execute SQL script
const initializeDatabase = async () => {
    try {
        // Connect to the database server (without specifying a database)
        await new Promise((resolve, reject) => {
            db.connect((err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });

        // Drop the existing database if it exists
        await executeSqlQuery('DROP DATABASE IF EXISTS web_development;');
        
        // Create the new database
        await executeSqlQuery('CREATE DATABASE web_development;');
        
        // Select the new database
        await executeSqlQuery('USE web_development;');

        // Read the SQL file
        const sqlFilePath = path.join(__dirname, process.env.SQL_FILE_PATH);
        const sqlFileContent = fs.readFileSync(sqlFilePath, 'utf8');

        // Execute the SQL statements from the file
        const sqlStatements = sqlFileContent.split(/;\s*(?=[^\s])/);
        for (const statement of sqlStatements) {
            if (statement.trim()) {
                await executeSqlQuery(statement);
            }
        }

        console.log('Database import completed successfully.');
    } catch (error) {
        console.error('Error executing SQL script:', error);
        process.exit(1); // Exit the process with an error code
    }
};

// Initialize the database and start the server
initializeDatabase().then(() => {
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
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const forumRoutes = require('./routes/forumRoutes'); // Adjust path as necessary
const statisticsRoutes = require('./routes/statisticsRoutes');
const symptomRoutes = require('./routes/symptom');
const locationRoutes = require('./routes/locationRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const specializations = require('./routes/specializations')

app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use(patientRoutes);
app.use(doctorRoutes);
app.use(specializations)
app.use(appointmentsRoutes);
app.use('/forum', forumRoutes);
app.use('/statistics', statisticsRoutes);
app.use('/api',symptomRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/rate', ratingRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
}).catch(err => {
console.error('Failed to initialize database:', err);
process.exit(1); // Exit the process with an error code
});

module.exports = app;
