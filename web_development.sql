
-- Drop tables if they exist (optional if starting fresh)
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'patient') NOT NULL
);

-- Create patients table
CREATE TABLE patients (
    id_patient INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    patient_age INT NOT NULL,
    patient_description TEXT,
    specialization_needed ENUM('Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Pulmonology', 'Otolaryngology') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctors table
CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name VARCHAR(100) NOT NULL,
    specialization ENUM('Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Pulmonology', 'Otolaryngology') NOT NULL,
    doctor_description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE appointments (
    id_appointment INT AUTO_INCREMENT PRIMARY KEY,
    id_patient INT,
    id_doctor INT,
    day_to_meet DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_patient) REFERENCES patients(id_patient)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    FOREIGN KEY (id_doctor) REFERENCES doctors(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);