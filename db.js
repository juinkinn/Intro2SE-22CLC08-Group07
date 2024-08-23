const mysql = require('mysql');
const util = require('util');

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

const query = util.promisify(db.query).bind(db);

// Forum functionalities
const getPosts = async () => {
    const sql = `SELECT posts.*, users.name AS authorName, users.role AS authorRole
                 FROM posts
                 JOIN users ON posts.author_id = users.id`;
    return await query(sql);
};

const getCommentsByPostId = async (postId) => {
    const sql = `SELECT comments.*, users.name AS authorName, users.role AS authorRole
                 FROM comments
                 JOIN users ON comments.author_id = users.id
                 WHERE comments.post_id = ? AND comments.parent_comment_id IS NULL`;
    return await query(sql, [postId]);
};

const getCommentsByParentCommentId = async (parentCommentId) => {
    const sql = `SELECT comments.*, users.name AS authorName, users.role AS authorRole
                 FROM comments
                 JOIN users ON comments.author_id = users.id
                 WHERE comments.parent_comment_id = ?`;
    return await query(sql, [parentCommentId]);
};

const createPost = async (authorId, content) => {
    const sql = 'INSERT INTO posts (author_id, content) VALUES (?, ?)';
    const result = await query(sql, [authorId, content]);
    const post = { id: result.insertId, author_id: authorId, content };
    const author = await getUserById(authorId);
    return { ...post, authorName: author.name, authorRole: author.role };
};

const addComment = async (postId, authorId, content, parentCommentId = null) => {
    const sql = 'INSERT INTO comments (post_id, author_id, content, parent_comment_id) VALUES (?, ?, ?, ?)';
    const result = await query(sql, [postId, authorId, content, parentCommentId]);
    const comment = { id: result.insertId, post_id: postId, author_id: authorId, content, parent_comment_id: parentCommentId };
    const author = await getUserById(authorId);
    return { ...comment, authorName: author.name, authorRole: author.role };
};

const updatePost = async (postId, content) => {
    const sql = 'UPDATE posts SET content = ? WHERE id = ?';
    await query(sql, [content, postId]);
};

const deletePost = async (postId) => {
    const sql = 'DELETE FROM posts WHERE id = ?';
    await query(sql, [postId]);
};

const getPostById = async (postId) => {
    const sql = 'SELECT * FROM posts WHERE id = ?';
    const result = await query(sql, [postId]);
    return result[0];
};

const updateComment = async (commentId, content) => {
    const sql = 'UPDATE comments SET content = ? WHERE id = ?';
    await query(sql, [content, commentId]);
};

const deleteComment = async (commentId) => {
    const sql = 'DELETE FROM comments WHERE id = ?';
    await query(sql, [commentId]);
};

const getCommentById = async (commentId) => {
    const sql = 'SELECT * FROM comments WHERE id = ?';
    const result = await query(sql, [commentId]);
    return result[0];
};

const getUserById = async (userId) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const result = await query(sql, [userId]);
    return result[0];
};

// Appointment functionalities
const createAppointment = async (doctorId, patientId, patientName, patientEmail, patientPhone, appointmentDate, appointmentTime) => {
    const sql = 'INSERT INTO appointments (id_doctor, id_patient, patient_name, patient_email, patient_phone, day_to_meet, time_to_meet, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const result = await query(sql, [doctorId, patientId, patientName, patientEmail, patientPhone, appointmentDate, appointmentTime, 'pending']);
    return { id_appointment: result.insertId, doctorId, patientId, patientName, patientEmail, patientPhone, appointmentDate, appointmentTime, status: 'pending' };
};

const getDoctorsBySpecialization = async (specialization) => {
    const sql = 'SELECT * FROM doctors WHERE specialization = ?';
    return await query(sql, [specialization]);
};

const getAppointmentsByDoctor = async (doctorId) => {
    const sql = `SELECT a.*, a.patient_name, a.patient_email, a.patient_phone, a.day_to_meet, a.time_to_meet 
                 FROM appointments a
                 WHERE a.id_doctor = ?`;
    return await query(sql, [doctorId]);
};

const updateAppointmentStatus = async (appointmentId, status) => {
    const sql = 'UPDATE appointments SET status = ? WHERE id_appointment = ?';
    await query(sql, [status, appointmentId]);
};

const searchSymptoms = async (symptomName) => {
    const sql = `SELECT d.name AS disease_name, s.name AS symptom_name
                 FROM symptoms s
                 JOIN disease_symptoms ds ON s.id = ds.symptom_id
                 JOIN diseases d ON ds.disease_id = d.id
                 WHERE s.name LIKE ?`;
    return await query(sql, [`%${symptomName}%`]);
};

module.exports = {
    query,
    // Forum methods
    getPosts,
    getCommentsByPostId,
    getCommentsByParentCommentId,
    createPost,
    addComment,
    updatePost,
    deletePost,
    getPostById,
    updateComment,
    deleteComment,
    getCommentById,
    getUserById,
    // Appointment methods
    createAppointment,
    getDoctorsBySpecialization,
    getAppointmentsByDoctor,
    updateAppointmentStatus,
    searchSymptoms
};
