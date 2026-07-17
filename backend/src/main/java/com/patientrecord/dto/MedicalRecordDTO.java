package com.patientrecord.dto;

public class MedicalRecordDTO {
    private String id; // recordId
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctor; // maps to doctorName
    private String diagnosis;
    private String symptoms;
    private String medicines;
    private String treatmentDetails;
    private String recordDate;
    private String date; // maps to recordDate string
    private String type;
    private String title;
    private String notes;

    // Constructors
    public MedicalRecordDTO() {}

    public MedicalRecordDTO(String id, String patientId, String patientName, String doctorId, String doctor,
                            String diagnosis, String symptoms, String medicines, String treatmentDetails,
                            String recordDate, String date, String type, String title, String notes) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctor = doctor;
        this.diagnosis = diagnosis;
        this.symptoms = symptoms;
        this.medicines = medicines;
        this.treatmentDetails = treatmentDetails;
        this.recordDate = recordDate;
        this.date = date;
        this.type = type;
        this.title = title;
        this.notes = notes;
    }

    // Builder support
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String patientId;
        private String patientName;
        private String doctorId;
        private String doctor;
        private String diagnosis;
        private String symptoms;
        private String medicines;
        private String treatmentDetails;
        private String recordDate;
        private String date;
        private String type;
        private String title;
        private String notes;

        public Builder id(String id) { this.id = id; return this; }
        public Builder patientId(String patientId) { this.patientId = patientId; return this; }
        public Builder patientName(String patientName) { this.patientName = patientName; return this; }
        public Builder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
        public Builder doctor(String doctor) { this.doctor = doctor; return this; }
        public Builder diagnosis(String diagnosis) { this.diagnosis = diagnosis; return this; }
        public Builder symptoms(String symptoms) { this.symptoms = symptoms; return this; }
        public Builder medicines(String medicines) { this.medicines = medicines; return this; }
        public Builder treatmentDetails(String treatmentDetails) { this.treatmentDetails = treatmentDetails; return this; }
        public Builder recordDate(String recordDate) { this.recordDate = recordDate; return this; }
        public Builder date(String date) { this.date = date; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }

        public MedicalRecordDTO build() {
            return new MedicalRecordDTO(id, patientId, patientName, doctorId, doctor, diagnosis, symptoms, medicines, treatmentDetails, recordDate, date, type, title, notes);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctor() { return doctor; }
    public void setDoctor(String doctor) { this.doctor = doctor; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getMedicines() { return medicines; }
    public void setMedicines(String medicines) { this.medicines = medicines; }

    public String getTreatmentDetails() { return treatmentDetails; }
    public void setTreatmentDetails(String treatmentDetails) { this.treatmentDetails = treatmentDetails; }

    public String getRecordDate() { return recordDate; }
    public void setRecordDate(String recordDate) { this.recordDate = recordDate; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
