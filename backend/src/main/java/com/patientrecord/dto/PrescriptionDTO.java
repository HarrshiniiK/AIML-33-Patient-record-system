package com.patientrecord.dto;

public class PrescriptionDTO {
    private String id;
    private String patientId;
    private String patientName;
    private String name;
    private String dosage;
    private String duration;
    private String notes;
    private String status;

    // Constructors
    public PrescriptionDTO() {}

    public PrescriptionDTO(String id, String patientId, String patientName, String name, String dosage, String duration, String notes, String status) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.name = name;
        this.dosage = dosage;
        this.duration = duration;
        this.notes = notes;
        this.status = status;
    }

    // Builder support
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String patientId;
        private String patientName;
        private String name;
        private String dosage;
        private String duration;
        private String notes;
        private String status;

        public Builder id(String id) { this.id = id; return this; }
        public Builder patientId(String patientId) { this.patientId = patientId; return this; }
        public Builder patientName(String patientName) { this.patientName = patientName; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder dosage(String dosage) { this.dosage = dosage; return this; }
        public Builder duration(String duration) { this.duration = duration; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder status(String status) { this.status = status; return this; }

        public PrescriptionDTO build() {
            return new PrescriptionDTO(id, patientId, patientName, name, dosage, duration, notes, status);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

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
}
