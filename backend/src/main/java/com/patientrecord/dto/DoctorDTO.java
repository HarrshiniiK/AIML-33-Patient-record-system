package com.patientrecord.dto;

public class DoctorDTO {
    private String id;
    private String name;
    private String specialization;
    private String phone;
    private String email;
    private Integer experience;
    private String availability;

    // Constructors
    public DoctorDTO() {}

    public DoctorDTO(String id, String name, String specialization, String phone, String email, Integer experience, String availability) {
        this.id = id;
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
        private String id;
        private String name;
        private String specialization;
        private String phone;
        private String email;
        private Integer experience;
        private String availability;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder specialization(String specialization) { this.specialization = specialization; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder experience(Integer experience) { this.experience = experience; return this; }
        public Builder availability(String availability) { this.availability = availability; return this; }

        public DoctorDTO build() {
            return new DoctorDTO(id, name, specialization, phone, email, experience, availability);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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
}
