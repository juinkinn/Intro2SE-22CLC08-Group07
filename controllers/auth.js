
// const mysql = require("mysql");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const { promisify } = require("util");

// const db = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
// });

// // Register a new user
// exports.register = (req, res) => {
//     console.log(req.body);
//     const { name, email, password, passwordConfirm } = req.body;
//     db.query('SELECT email from users WHERE email = ?', [email], async (err, results) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).json({ message: 'Internal server error' });
//         }

//         if (results.length > 0) {
//             console.log("Email is already in use");
//             return res.status(400).json({ message: "Email is already in use" });
//         }

//         if (password !== passwordConfirm) {
//             console.log("Passwords do not match");
//             return res.status(400).json({ message: "Passwords do not match" });
//         }

//         let hashedPassword = await bcrypt.hash(password, 8); // Hash the password

//         db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).json({ message: 'Failed to register user' });
//             }
//             console.log("User registered successfully")
//             res.status(201).json({ message: "User registered successfully" });
//         });
//     });
// };

// // Login user
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ message: "Please provide an email and password" });
//         }

//         db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
//             if (err) {
//                 console.log(err);
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

//             const token = jwt.sign({ id }, process.env.JWT_SECRET, {
//                 expiresIn: process.env.JWT_EXPIRES_IN
//             });

//             console.log("Generated token:", token); // Log the generated token

//             const cookieOptions = {
//                 expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
//                 httpOnly: true
//             };

//             res.cookie('userSave', token, cookieOptions); // Set the cookie

//             // Send a response indicating successful login
//             res.status(200).json({ message: "Login successful" }); // Optionally, send JSON response

//             // Uncomment below line if redirect doesn't happen on frontend
//             // res.status(200).redirect("/profile.html"); // Redirect to profile.html upon successful login
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // Middleware to check if user is logged in
// exports.isLoggedIn = async (req, res, next) => {
//     if (req.cookies.userSave) {
//         try {
//             // Verify the token
//             const decoded = await promisify(jwt.verify)(req.cookies.userSave, process.env.JWT_SECRET);

//             // Check if the user still exists
//             db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, results) => {
//                 if (err) {
//                     console.error(err);
//                     return next();
//                 }
//                 if (!results || results.length === 0) {
//                     return next();
//                 }
//                 req.user = results[0];
//                 return next();
//             });
//         } catch (err) {
//             console.error(err);
//             return next();
//         }
//     } else {
//         next();
//     }
// };

// // Logout user
// exports.logout = (req, res) => {
//     res.clearCookie('userSave');
//     res.status(200).redirect("/main.html"); // Redirect to main page upon logout
// };


// 27/06/2024
// ================== End of MySQL_Login_Page/controllers/auth.js ==================


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
    console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;
    
    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length > 0) {
            console.log("Email is already in use");
            return res.status(400).json({ message: "Email is already in use" });
        }
/*
        if (password !== passwordConfirm) {
            console.log("Passwords do not match");
            return res.status(400).json({ message: "Passwords do not match" });
        }
*/
        let hashedPassword = await bcrypt.hash(password, 8); // Hash the password

        // Determine the user's role based on their email
        let role = 'patient'; // Default role
        if (email.endsWith('@admin.com')) {
            role = 'admin';
        } else if (email.endsWith('@doctor.com')) {
            role = 'doctor';
        }

        db.query('INSERT INTO users SET ?', { name, email, password: hashedPassword, role }, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Failed to register user' });
            }
            console.log("User registered successfully")
            res.status(201).json({ message: "User registered successfully" });
        });
    });
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide an email and password" });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.log(err);
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

            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            console.log("Generated token:", token); // Log the generated token

            const cookieOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            res.cookie('userSave', token, cookieOptions); // Set the cookie
            res.cookie('userName', name); // Set the user's name in a cookie
            res.cookie('userRole', role); // Set the user's role in a cookie

            // Send a response indicating successful login
            res.status(200).json({ message: "Login successful" }); // Optionally, send JSON response

            // Uncomment below line if redirect doesn't happen on frontend
            // res.status(200).redirect("/profile.html"); // Redirect to profile.html upon successful login
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Middleware to check if user is logged in
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.userSave) {
        try {
            // Verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.userSave, process.env.JWT_SECRET);

            // Check if the user still exists
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, results) => {
                if (err) {
                    console.error(err);
                    return next();
                }
                if (!results || results.length === 0) {
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (err) {
            console.error(err);
            return next();
        }
    } else {
        next();
    }
};

// Logout user
exports.logout = (req, res) => {
    res.clearCookie('userSave');
    res.clearCookie('userName');
    res.clearCookie('userRole');
    res.status(200).redirect("/main.html"); // Redirect to main page upon logout
};
