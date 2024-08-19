const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

// Register a new user
exports.register = (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    // Check if email already exists
    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error("Error checking existing email:", err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length > 0) {
            console.log("Email is already in use");
            return res.status(400).json({ message: "Email is already in use" });
        }


        try {
            const hashedPassword = await bcrypt.hash(password, 8); // Hash the password

            // Determine the user's role based on their email domain
            let role = 'patient'; // Default role
            if (email.endsWith('@admin.com') || email.includes('.medimate')) {
                role = 'admin';
            } else if (email.endsWith('@doctor.com') || email.includes('.doctor')) {
                role = 'doctor';
            }

            // Insert new user into database
            db.query('INSERT INTO users SET ?', { name, email, password: hashedPassword, role }, (err, results) => {
                if (err) {
                    console.error("Error registering user:", err);
                    return res.status(500).json({ message: 'Failed to register user' });
                }
                console.log("User registered successfully");
                res.status(201).json({ message: "User registered successfully" });
            });
        } catch (error) {
            console.error("Error hashing password:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
};

// Login user
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ message: "Please provide an email and password" });
//         }

//         // Retrieve user by email
//         db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
//             if (err) {
//                 console.error("Error retrieving user:", err);
//                 return res.status(500).json({ message: 'Internal server error' });
//             }

//             if (!results || results.length === 0) {
//                 return res.status(401).json({ message: "Email or Password is incorrect" });
//             }

//             const hashedPassword = results[0].password;
//             const isMatch = await bcrypt.compare(password, hashedPassword);

//             if (!isMatch) {
//                 return res.status(401).json({ message: "Email or Password is incorrect" });
//             }

//             const id = results[0].id;
//             const name = results[0].name;
//             const role = results[0].role;

//             // Generate JWT token
//             const token = jwt.sign({ id }, process.env.JWT_SECRET, {
//                 expiresIn: process.env.JWT_EXPIRES_IN
//             });

//             console.log("Generated token:", token);

//             // Set cookies
//             const cookieOptions = {
//                 expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
//                 httpOnly: true
//             };

//             res.cookie('userSave', token, cookieOptions);
//             res.cookie('userName', name);
//             res.cookie('userRole', role);

//             res.status(200).json({ message: "Login successful" });
//         });
//     } catch (err) {
//         console.error("Error logging in:", err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide an email and password" });
        }

        // Retrieve user by email
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error("Error retrieving user:", err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!results || results.length === 0) {
                return res.status(401).json({ message: "Email or Password is incorrect" });
            }

            const hashedPassword = results[0].password;
            const isMatch = await bcrypt.compare(password, hashedPassword);

            if (!isMatch) {
                return res.status(401).json({ message: "Email or Password is incorrect" });
            }

            const id = results[0].id;
            const name = results[0].name;
            const role = results[0].role;

            // Generate JWT token
            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            console.log("Generated token:", token);

            // Set cookies
            const cookieOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            res.cookie('userSave', token, cookieOptions);
            res.cookie('userName', name);
            res.cookie('userRole', role);

            res.status(200).json({
                message: "Login successful",
                userId: id,
                userName: name,
                userRole: role
            });
        });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Middleware to check if user is logged in
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.userSave) {
        try {
            // Verify JWT token
            const decoded = await promisify(jwt.verify)(req.cookies.userSave, process.env.JWT_SECRET);

            // Check if user exists
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, results) => {
                if (err) {
                    console.error("Error checking user:", err);
                    return next();
                }
                if (!results || results.length === 0) {
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (err) {
            console.error("Error verifying token:", err);
            return next();
        }
    } else {
        next();
    }
};

// Logout user
exports.logout = (req, res) => {
    // Clear cookies
    res.clearCookie('userSave');
    res.clearCookie('userName');
    res.clearCookie('userRole');

    res.status(200).redirect("/main.html"); // Redirect to main page upon logout
};
