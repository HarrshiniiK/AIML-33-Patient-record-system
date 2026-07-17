package com.patientrecord.dto;

import java.time.LocalDate;

public class PatientDTO {
    private String id; // maps from patientId
    private String name;
    private String firstName;
    private String lastName;
    private Integer age;
    private String gender;
    private LocalDate dateOfBirth;
    private String dob; // String representation of dateOfBirth
    private String bloodGroup;
    private String phone;
    private String email;
    private String address;
    private String emergencyContact;
    private String disease;
    private String status;
    private String admittedDate; // String representation of admittedDate
    private String assignedDoctor;

    // Constructors
    public PatientDTO() {}

    public PatientDTO(String id, String name, String firstName, String lastName, Integer age, String gender,
                      LocalDate dateOfBirth, String dob, String bloodGroup, String phone, String email,
                      String address, String emergencyContact, String disease, String status, String admittedDate,
                      String assignedDoctor) {
        this.id = id;
        this.name = name;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.dob = dob;
        this.bloodGroup = bloodGroup;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.disease = disease;
        this.status = status;
        this.admittedDate = admittedDate;
        this.assignedDoctor = assignedDoctor;
    }

    // Builder support
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private String firstName;
        private String lastName;
        private Integer age;
        private String gender;
        private LocalDate dateOfBirth;
        private String dob;
        private String bloodGroup;
        private String phone;
        private String email;
        private String address;
        private String emergencyContact;
        private String disease;
        private String status;
        private String admittedDate;
        private String assignedDoctor;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder firstName(String firstName) { this.firstName = firstName; return this; }
        public Builder lastName(String lastName) { this.lastName = lastName; return this; }
        public Builder age(Integer age) { this.age = age; return this; }
        public Builder gender(String gender) { this.gender = gender; return this; }
        public Builder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public Builder dob(String dob) { this.dob = dob; return this; }
        public Builder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public Builder disease(String disease) { this.disease = disease; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder admittedDate(String admittedDate) { this.admittedDate = admittedDate; return this; }
        public Builder assignedDoctor(String assignedDoctor) { this.assignedDoctor = assignedDoctor; return this; }

        public PatientDTO build() {
            return new PatientDTO(id, name, firstName, lastName, age, gender, dateOfBirth, dob, bloodGroup, phone, email, address, emergencyContact, disease, status, admittedDate, assignedDoctor);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

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

    public String getAdmittedDate() { return admittedDate; }
    public void setAdmittedDate(String admittedDate) { this.admittedDate = admittedDate; }

    public String getAssignedDoctor() { return assignedDoctor; }
    public void setAssignedDoctor(String assignedDoctor) { this.assignedDoctor = assignedDoctor; }
}
