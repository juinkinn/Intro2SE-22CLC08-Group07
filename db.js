const fs = require('fs');
const mysql = require('mysql');
require('dotenv').config();

// Create a MySQL connection to the server (without specifying a database)
const serverConnection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD
});

// Connect to the MySQL server
serverConnection.connect(err => {
    if (err) {
        console.error('Error connecting to the MySQL server:', err);
        return;
    }
    console.log('Connected to the MySQL server.');

    // Create the database if it doesn't exist
    serverConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`, (err) => {
        if (err) {
            console.error('Error creating database:', err);
            serverConnection.end();
            return;
        }
        console.log(`Database ${process.env.DATABASE} created or already exists.`);

        // Connect to the newly created database
        const dbConnection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.DATABASE_USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });

        dbConnection.connect(err => {
            if (err) {
                console.error('Error connecting to the database:', err);
                return;
            }
            console.log(`Connected to the MySQL database: ${process.env.DATABASE}`);

            // Read the .sql file
            fs.readFile(process.env.SQL_FILE_PATH, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading the SQL file:', err);
                    dbConnection.end();
                    return;
                }

                // Split the SQL commands by semicolon
                const sqlCommands = data.split(';');

                // Execute each command
                sqlCommands.forEach(command => {
                    if (command.trim()) {
                        dbConnection.query(command, (err, results) => {
                            if (err) {
                                console.error(`Error executing command: ${command.trim()}`);
                                console.error(`Error: ${err}`);
                            }
                        });
                    }
                });

                // Close the connection
                dbConnection.end(() => {
                    console.log("Database import completed.");
                });
            });
        });
    });
});

module.exports = serverConnection;
