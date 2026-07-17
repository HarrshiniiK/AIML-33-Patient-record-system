package com.patientrecord.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @Column(nullable = false)
    private String name;

    private String dosage;

    private String duration;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String status; // Active, Inactive, Pending review

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public Prescription() {}

    public Prescription(Long id, Patient patient, String name, String dosage, String duration, String notes, String status, LocalDateTime createdAt) {
        this.id = id;
        this.patient = patient;
        this.name = name;
        this.dosage = dosage;
        this.duration = duration;
        this.notes = notes;
        this.status = status;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "Active";
        }
    }

    // Builder support
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Patient patient;
        private String name;
        private String dosage;
        private String duration;
        private String notes;
        private String status;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder patient(Patient patient) { this.patient = patient; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder dosage(String dosage) { this.dosage = dosage; return this; }
        public Builder duration(String duration) { this.duration = duration; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Prescription build() {
            return new Prescription(id, patient, name, dosage, duration, notes, status, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
