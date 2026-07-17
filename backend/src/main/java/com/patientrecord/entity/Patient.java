package com.patientrecord.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Long patientId;

    @Column(nullable = false)
    private String name;

    private Integer age;

    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "blood_group")
    private String bloodGroup;

    private String phone;

    private String email;

    private String address;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    private String disease;

    private String status; // Outpatient, Admitted, Discharged

    @Column(name = "admitted_date")
    private LocalDate admittedDate;

    @Column(name = "assigned_doctor")
    private String assignedDoctor;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicalRecord> medicalRecords;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments;

    // Constructors
    public Patient() {}

    public Patient(Long patientId, String name, Integer age, String gender, LocalDate dateOfBirth, String bloodGroup,
                   String phone, String email, String address, String emergencyContact, String disease,
                   String status, LocalDate admittedDate, String assignedDoctor, LocalDateTime createdAt) {
        this.patientId = patientId;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.bloodGroup = bloodGroup;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.disease = disease;
        this.status = status;
        this.admittedDate = admittedDate;
        this.assignedDoctor = assignedDoctor;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "Outpatient";
        }
    }

    // Builder support
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long patientId;
        private String name;
        private Integer age;
        private String gender;
        private LocalDate dateOfBirth;
        private String bloodGroup;
        private String phone;
        private String email;
        private String address;
        private String emergencyContact;
        private String disease;
        private String status;
        private LocalDate admittedDate;
        private String assignedDoctor;
        private LocalDateTime createdAt;

        public Builder patientId(Long patientId) { this.patientId = patientId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder age(Integer age) { this.age = age; return this; }
        public Builder gender(String gender) { this.gender = gender; return this; }
        public Builder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public Builder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public Builder disease(String disease) { this.disease = disease; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder admittedDate(LocalDate admittedDate) { this.admittedDate = admittedDate; return this; }
        public Builder assignedDoctor(String assignedDoctor) { this.assignedDoctor = assignedDoctor; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Patient build() {
            return new Patient(patientId, name, age, gender, dateOfBirth, bloodGroup, phone, email, address, emergencyContact, disease, status, admittedDate, assignedDoctor, createdAt);
        }
    }

    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getAdmittedDate() { return admittedDate; }
    public void setAdmittedDate(LocalDate admittedDate) { this.admittedDate = admittedDate; }

    public String getAssignedDoctor() { return assignedDoctor; }
    public void setAssignedDoctor(String assignedDoctor) { this.assignedDoctor = assignedDoctor; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<MedicalRecord> getMedicalRecords() { return medicalRecords; }
    public void setMedicalRecords(List<MedicalRecord> medicalRecords) { this.medicalRecords = medicalRecords; }

    public List<Appointment> getAppointments() { return appointments; }
    public void setAppointments(List<Appointment> appointments) { this.appointments = appointments; }
}
