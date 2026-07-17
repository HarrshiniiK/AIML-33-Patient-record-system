package com.patientrecord.dto;

public class AuthResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String token;
    private String patientId;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String id, String name, String email, String role, String phone, String token, String patientId) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.phone = phone;
        this.token = token;
        this.patientId = patientId;
    }

    // Builder support
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private String email;
        private String role;
        private String phone;
        private String token;
        private String patientId;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder token(String token) { this.token = token; return this; }
        public Builder patientId(String patientId) { this.patientId = patientId; return this; }

        public AuthResponse build() {
            return new AuthResponse(id, name, email, role, phone, token, patientId);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
}
