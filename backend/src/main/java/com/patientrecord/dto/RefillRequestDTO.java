package com.patientrecord.dto;

public class RefillRequestDTO {
    private String id;
    private String patientId;
    private String patientName;
    private String medication;
    private String dosage;
    private String duration;
    private String requestNotes;
    private String status;
    private String decisionNotes;
    private String decision; // frontend maps 'decision' to status update
    private String reviewNotes; // frontend maps 'reviewNotes' to decisionNotes

    // New fields
    private String prescriptionId;
    private String doctorId;
    private String requestedAt;
    private String patientMessage;
    private String doctorMessage;

    // Constructors
    public RefillRequestDTO() {}

    public RefillRequestDTO(String id, String patientId, String patientName, String medication, String dosage, String requestNotes, String status, String decisionNotes, String decision, String reviewNotes) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.medication = medication;
        this.dosage = dosage;
        this.requestNotes = requestNotes;
        this.status = status;
        this.decisionNotes = decisionNotes;
        this.decision = decision;
        this.reviewNotes = reviewNotes;
    }

    public RefillRequestDTO(String id, String patientId, String patientName, String medication, String dosage, String duration, String requestNotes, String status, String decisionNotes, String decision, String reviewNotes, String prescriptionId, String doctorId, String requestedAt, String patientMessage, String doctorMessage) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.medication = medication;
        this.dosage = dosage;
        this.duration = duration;
        this.requestNotes = requestNotes;
        this.status = status;
        this.decisionNotes = decisionNotes;
        this.decision = decision;
        this.reviewNotes = reviewNotes;
        this.prescriptionId = prescriptionId;
        this.doctorId = doctorId;
        this.requestedAt = requestedAt;
        this.patientMessage = patientMessage;
        this.doctorMessage = doctorMessage;
    }

    // Builder support
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String patientId;
        private String patientName;
        private String medication;
        private String dosage;
        private String duration;
        private String requestNotes;
        private String status;
        private String decisionNotes;
        private String decision;
        private String reviewNotes;
        private String prescriptionId;
        private String doctorId;
        private String requestedAt;
        private String patientMessage;
        private String doctorMessage;

        public Builder id(String id) { this.id = id; return this; }
        public Builder patientId(String patientId) { this.patientId = patientId; return this; }
        public Builder patientName(String patientName) { this.patientName = patientName; return this; }
        public Builder medication(String medication) { this.medication = medication; return this; }
        public Builder dosage(String dosage) { this.dosage = dosage; return this; }
        public Builder duration(String duration) { this.duration = duration; return this; }
        public Builder requestNotes(String requestNotes) { this.requestNotes = requestNotes; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder decisionNotes(String decisionNotes) { this.decisionNotes = decisionNotes; return this; }
        public Builder decision(String decision) { this.decision = decision; return this; }
        public Builder reviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; return this; }
        public Builder prescriptionId(String prescriptionId) { this.prescriptionId = prescriptionId; return this; }
        public Builder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
        public Builder requestedAt(String requestedAt) { this.requestedAt = requestedAt; return this; }
        public Builder patientMessage(String patientMessage) { this.patientMessage = patientMessage; return this; }
        public Builder doctorMessage(String doctorMessage) { this.doctorMessage = doctorMessage; return this; }

        public RefillRequestDTO build() {
            return new RefillRequestDTO(id, patientId, patientName, medication, dosage, duration, requestNotes, status, decisionNotes, decision, reviewNotes, prescriptionId, doctorId, requestedAt, patientMessage, doctorMessage);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

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

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }

    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }

    public String getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(String prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getRequestedAt() { return requestedAt; }
    public void setRequestedAt(String requestedAt) { this.requestedAt = requestedAt; }

    public String getPatientMessage() { return patientMessage; }
    public void setPatientMessage(String patientMessage) { this.patientMessage = patientMessage; }

    public String getDoctorMessage() { return doctorMessage; }
    public void setDoctorMessage(String doctorMessage) { this.doctorMessage = doctorMessage; }
}
