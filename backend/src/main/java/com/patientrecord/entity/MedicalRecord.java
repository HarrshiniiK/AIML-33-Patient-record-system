package com.patientrecord.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "medical_records")
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(columnDefinition = "TEXT")
    private String medicines;

    @Column(name = "treatment_details", columnDefinition = "TEXT")
    private String treatmentDetails;

    @Column(name = "record_date")
    private LocalDate recordDate;

    // Frontend fields
    private String type; // 'Prescription', 'Lab Report', 'Imaging'
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "doctor_name")
    private String doctorName;

    // Constructors
    public MedicalRecord() {}

    public MedicalRecord(Long recordId, Patient patient, Doctor doctor, String diagnosis, String symptoms,
                         String medicines, String treatmentDetails, LocalDate recordDate, String type,
                         String title, String notes, String doctorName) {
        this.recordId = recordId;
        this.patient = patient;
        this.doctor = doctor;
        this.diagnosis = diagnosis;
        this.symptoms = symptoms;
        this.medicines = medicines;
        this.treatmentDetails = treatmentDetails;
        this.recordDate = recordDate;
        this.type = type;
        this.title = title;
        this.notes = notes;
        this.doctorName = doctorName;
    }

    // Builder support
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long recordId;
        private Patient patient;
        private Doctor doctor;
        private String diagnosis;
        private String symptoms;
        private String medicines;
        private String treatmentDetails;
        private LocalDate recordDate;
        private String type;
        private String title;
        private String notes;
        private String doctorName;

        public Builder recordId(Long recordId) { this.recordId = recordId; return this; }
        public Builder patient(Patient patient) { this.patient = patient; return this; }
        public Builder doctor(Doctor doctor) { this.doctor = doctor; return this; }
        public Builder diagnosis(String diagnosis) { this.diagnosis = diagnosis; return this; }
        public Builder symptoms(String symptoms) { this.symptoms = symptoms; return this; }
        public Builder medicines(String medicines) { this.medicines = medicines; return this; }
        public Builder treatmentDetails(String treatmentDetails) { this.treatmentDetails = treatmentDetails; return this; }
        public Builder recordDate(LocalDate recordDate) { this.recordDate = recordDate; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder doctorName(String doctorName) { this.doctorName = doctorName; return this; }

        public MedicalRecord build() {
            return new MedicalRecord(recordId, patient, doctor, diagnosis, symptoms, medicines, treatmentDetails, recordDate, type, title, notes, doctorName);
        }
    }

    // Getters and Setters
    public Long getRecordId() { return recordId; }
    public void setRecordId(Long recordId) { this.recordId = recordId; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getMedicines() { return medicines; }
    public void setMedicines(String medicines) { this.medicines = medicines; }

    public String getTreatmentDetails() { return treatmentDetails; }
    public void setTreatmentDetails(String treatmentDetails) { this.treatmentDetails = treatmentDetails; }

    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
}
