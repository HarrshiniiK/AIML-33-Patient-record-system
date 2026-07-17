package com.patientrecord.service;

import com.patientrecord.dto.NotificationDTO;
import java.util.List;

public interface NotificationService {
    List<NotificationDTO> getNotifications(Long recipientId, String recipientRole);
    NotificationDTO createNotification(NotificationDTO dto);
    NotificationDTO markAsRead(Long id);
}
