-- MySQL Script for Patient Record System Database
-- Database: patient_record_db

CREATE DATABASE IF NOT EXISTS patient_record_db;
USE patient_record_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'DOCTOR', 'STAFF', 'PATIENT')),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(50),
    date_of_birth DATE,
    blood_group VARCHAR(10),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    emergency_contact VARCHAR(255),
    disease VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Outpatient',
    admitted_date DATE,
    assigned_doctor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    experience INT,
    availability VARCHAR(255)
);

-- 4. Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    diagnosis TEXT,
    symptoms TEXT,
    medicines TEXT,
    treatment_details TEXT,
    record_date DATE,
    type VARCHAR(50),
    title VARCHAR(255),
    notes TEXT,
    doctor_name VARCHAR(255),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE SET NULL
);

-- 5. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    appointment_date DATE,
    appointment_time TIME,
    status VARCHAR(50) DEFAULT 'Pending',
    reason VARCHAR(255),
    patient_name VARCHAR(255),
    doctor_name VARCHAR(255),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
);

-- 6. Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(255),
    duration VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- 7. Refill Requests Table
CREATE TABLE IF NOT EXISTS refill_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    patient_name VARCHAR(255),
    medication VARCHAR(255),
    dosage VARCHAR(255),
    request_notes TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    decision_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

