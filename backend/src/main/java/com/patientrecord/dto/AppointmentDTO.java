package com.patientrecord.dto;

public class AppointmentDTO {
    private String id; // appointmentId
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctorName;
    private String date; // appointmentDate
    private String time; // appointmentTime
    private String status;
    private String reason;
    private String remarks;

    // Constructors
    public AppointmentDTO() {}

    public AppointmentDTO(String id, String patientId, String patientName, String doctorId, String doctorName,
                          String date, String time, String status, String reason) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.date = date;
        this.time = time;
        this.status = status;
        this.reason = reason;
    }

    public AppointmentDTO(String id, String patientId, String patientName, String doctorId, String doctorName,
                          String date, String time, String status, String reason, String remarks) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.date = date;
        this.time = time;
        this.status = status;
        this.reason = reason;
        this.remarks = remarks;
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
        private String doctorName;
        private String date;
        private String time;
        private String status;
        private String reason;
        private String remarks;

        public Builder id(String id) { this.id = id; return this; }
        public Builder patientId(String patientId) { this.patientId = patientId; return this; }
        public Builder patientName(String patientName) { this.patientName = patientName; return this; }
        public Builder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
        public Builder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public Builder date(String date) { this.date = date; return this; }
        public Builder time(String time) { this.time = time; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }

        public AppointmentDTO build() {
            return new AppointmentDTO(id, patientId, patientName, doctorId, doctorName, date, time, status, reason, remarks);
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

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
