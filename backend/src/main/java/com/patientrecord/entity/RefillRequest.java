package com.patientrecord.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "refill_requests")
public class RefillRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @Column(name = "patient_name")
    private String patientName;

    private String medication;

    private String dosage;

    private String duration;

    @Column(name = "request_notes", columnDefinition = "TEXT")
    private String requestNotes;

    private String status; // Pending, Approved, Declined, Book appointment

    @Column(name = "decision_notes", columnDefinition = "TEXT")
    private String decisionNotes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // New requested fields
    @Column(name = "prescription_id")
    private Long prescriptionId;

    @Column(name = "doctor_id")
    private Long doctorId;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @Column(name = "patient_message", columnDefinition = "TEXT")
    private String patientMessage;

    @Column(name = "doctor_message", columnDefinition = "TEXT")
    private String doctorMessage;

    // Constructors
    public RefillRequest() {}

    public RefillRequest(Long id, Patient patient, String patientName, String medication, String dosage, String requestNotes, String status, String decisionNotes, LocalDateTime createdAt) {
        this.id = id;
        this.patient = patient;
        this.patientName = patientName;
        this.medication = medication;
        this.dosage = dosage;
        this.requestNotes = requestNotes;
        this.status = status;
        this.decisionNotes = decisionNotes;
        this.createdAt = createdAt;
    }

    public RefillRequest(Long id, Patient patient, String patientName, String medication, String dosage, String duration, String requestNotes, String status, String decisionNotes, LocalDateTime createdAt, Long prescriptionId, Long doctorId, LocalDateTime requestedAt, String patientMessage, String doctorMessage) {
        this.id = id;
        this.patient = patient;
        this.patientName = patientName;
        this.medication = medication;
        this.dosage = dosage;
        this.duration = duration;
        this.requestNotes = requestNotes;
        this.status = status;
        this.decisionNotes = decisionNotes;
        this.createdAt = createdAt;
        this.prescriptionId = prescriptionId;
        this.doctorId = doctorId;
        this.requestedAt = requestedAt;
        this.patientMessage = patientMessage;
        this.doctorMessage = doctorMessage;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.requestedAt == null) {
            this.requestedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "Pending";
        }
    }

    // Builder support
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Patient patient;
        private String patientName;
        private String medication;
        private String dosage;
        private String duration;
        private String requestNotes;
        private String status;
        private String decisionNotes;
        private LocalDateTime createdAt;
        private Long prescriptionId;
        private Long doctorId;
        private LocalDateTime requestedAt;
        private String patientMessage;
        private String doctorMessage;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder patient(Patient patient) { this.patient = patient; return this; }
        public Builder patientName(String patientName) { this.patientName = patientName; return this; }
        public Builder medication(String medication) { this.medication = medication; return this; }
        public Builder dosage(String dosage) { this.dosage = dosage; return this; }
        public Builder duration(String duration) { this.duration = duration; return this; }
        public Builder requestNotes(String requestNotes) { this.requestNotes = requestNotes; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder decisionNotes(String decisionNotes) { this.decisionNotes = decisionNotes; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder prescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; return this; }
        public Builder doctorId(Long doctorId) { this.doctorId = doctorId; return this; }
        public Builder requestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; return this; }
        public Builder patientMessage(String patientMessage) { this.patientMessage = patientMessage; return this; }
        public Builder doctorMessage(String doctorMessage) { this.doctorMessage = doctorMessage; return this; }

        public RefillRequest build() {
            return new RefillRequest(id, patient, patientName, medication, dosage, duration, requestNotes, status, decisionNotes, createdAt, prescriptionId, doctorId, requestedAt, patientMessage, doctorMessage);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getMedication() { return medication; }
    public void setMedication(String medication) { this.medication = medication; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getRequestNotes() { return requestNotes; }
    public void setRequestNotes(String requestNotes) { this.requestNotes = requestNotes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDecisionNotes() { return decisionNotes; }
    public void setDecisionNotes(String decisionNotes) { this.decisionNotes = decisionNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public String getPatientMessage() { return patientMessage; }
    public void setPatientMessage(String patientMessage) { this.patientMessage = patientMessage; }

    public String getDoctorMessage() { return doctorMessage; }
    public void setDoctorMessage(String doctorMessage) { this.doctorMessage = doctorMessage; }
}
