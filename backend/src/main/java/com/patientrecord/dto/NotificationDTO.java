package com.patientrecord.dto;

public class NotificationDTO {
    private String id;
    private String recipientRole;
    private String recipientId;
    private String title;
    private String message;
    private boolean isRead;
    private String createdAt;

    public NotificationDTO() {}

    public NotificationDTO(String id, String recipientRole, String recipientId, String title, String message, boolean isRead, String createdAt) {
        this.id = id;
        this.recipientRole = recipientRole;
        this.recipientId = recipientId;
        this.title = title;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String recipientRole;
        private String recipientId;
        private String title;
        private String message;
        private boolean isRead;
        private String createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder recipientRole(String recipientRole) { this.recipientRole = recipientRole; return this; }
        public Builder recipientId(String recipientId) { this.recipientId = recipientId; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder isRead(boolean isRead) { this.isRead = isRead; return this; }
        public Builder createdAt(String createdAt) { this.createdAt = createdAt; return this; }

        public NotificationDTO build() {
            return new NotificationDTO(id, recipientRole, recipientId, title, message, isRead, createdAt);
        }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRecipientRole() { return recipientRole; }
    public void setRecipientRole(String recipientRole) { this.recipientRole = recipientRole; }

    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
