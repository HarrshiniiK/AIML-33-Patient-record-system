package com.patientrecord.service.impl;

import com.patientrecord.dto.NotificationDTO;
import com.patientrecord.entity.Notification;
import com.patientrecord.exception.ResourceNotFoundException;
import com.patientrecord.repository.NotificationRepository;
import com.patientrecord.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<NotificationDTO> getNotifications(Long recipientId, String recipientRole) {
        List<Notification> list = notificationRepository.findByRecipientIdOrRecipientRoleOrderByCreatedAtDesc(recipientId, recipientRole);
        return list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public NotificationDTO createNotification(NotificationDTO dto) {
        Notification n = Notification.builder()
                .recipientRole(dto.getRecipientRole())
                .recipientId(dto.getRecipientId() != null && !dto.getRecipientId().isEmpty() ? Long.valueOf(dto.getRecipientId()) : null)
                .title(dto.getTitle())
                .message(dto.getMessage())
                .isRead(dto.isRead())
                .build();
        Notification saved = notificationRepository.save(n);
        return convertToDTO(saved);
    }

    @Override
    public NotificationDTO markAsRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        n.setRead(true);
        Notification updated = notificationRepository.save(n);
        return convertToDTO(updated);
    }

    private NotificationDTO convertToDTO(Notification n) {
        return NotificationDTO.builder()
                .id(String.valueOf(n.getId()))
                .recipientRole(n.getRecipientRole())
                .recipientId(n.getRecipientId() != null ? String.valueOf(n.getRecipientId()) : null)
                .title(n.getTitle())
                .message(n.getMessage())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().toString() : LocalDateTime.now().toString())
                .build();
    }
}
