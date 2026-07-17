package com.patientrecord.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Long doctorId;

    @Column(nullable = false)
    private String name;

    private String specialization;

    private String phone;

    private String email;

    private Integer experience;

    private String availability;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<MedicalRecord> medicalRecords;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<Appointment> appointments;

    // Constructors
    public Doctor() {}

    public Doctor(Long doctorId, String name, String specialization, String phone, String email, Integer experience, String availability) {
        this.doctorId = doctorId;
        this.name = name;
        this.specialization = specialization;
        this.phone = phone;
        this.email = email;
        this.experience = experience;
        this.availability = availability;
    }

    // Builder support
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long doctorId;
        private String name;
        private String specialization;
        private String phone;
        private String email;
        private Integer experience;
        private String availability;

        public Builder doctorId(Long doctorId) { this.doctorId = doctorId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder specialization(String specialization) { this.specialization = specialization; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder experience(Integer experience) { this.experience = experience; return this; }
        public Builder availability(String availability) { this.availability = availability; return this; }

        public Doctor build() {
            return new Doctor(doctorId, name, specialization, phone, email, experience, availability);
        }
    }

    // Getters and Setters
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }

    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }

    public List<MedicalRecord> getMedicalRecords() { return medicalRecords; }
    public void setMedicalRecords(List<MedicalRecord> medicalRecords) { this.medicalRecords = medicalRecords; }

    public List<Appointment> getAppointments() { return appointments; }
    public void setAppointments(List<Appointment> appointments) { this.appointments = appointments; }
}
