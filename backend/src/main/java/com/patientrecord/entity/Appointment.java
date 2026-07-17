package com.patientrecord.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Long appointmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "appointment_time")
    private LocalTime appointmentTime;

    private String status; // Pending, Confirmed, Cancelled, Rescheduled

    private String reason;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "doctor_name")
    private String doctorName;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    // Constructors
    public Appointment() {}

    public Appointment(Long appointmentId, Patient patient, Doctor doctor, LocalDate appointmentDate,
                        LocalTime appointmentTime, String status, String reason, String patientName, String doctorName) {
        this.appointmentId = appointmentId;
        this.patient = patient;
        this.doctor = doctor;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.reason = reason;
        this.patientName = patientName;
        this.doctorName = doctorName;
    }

    public Appointment(Long appointmentId, Patient patient, Doctor doctor, LocalDate appointmentDate,
                        LocalTime appointmentTime, String status, String reason, String patientName, String doctorName, String remarks) {
        this.appointmentId = appointmentId;
        this.patient = patient;
        this.doctor = doctor;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.reason = reason;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.remarks = remarks;
    }

    // Builder support
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long appointmentId;
        private Patient patient;
        private Doctor doctor;
        private LocalDate appointmentDate;
        private LocalTime appointmentTime;
        private String status;
        private String reason;
        private String patientName;
        private String doctorName;
        private String remarks;

        public Builder appointmentId(Long appointmentId) { this.appointmentId = appointmentId; return this; }
        public Builder patient(Patient patient) { this.patient = patient; return this; }
        public Builder doctor(Doctor doctor) { this.doctor = doctor; return this; }
        public Builder appointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public Builder appointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder patientName(String patientName) { this.patientName = patientName; return this; }
        public Builder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }

        public Appointment build() {
            return new Appointment(appointmentId, patient, doctor, appointmentDate, appointmentTime, status, reason, patientName, doctorName, remarks);
        }
    }

    // Getters and Setters
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
