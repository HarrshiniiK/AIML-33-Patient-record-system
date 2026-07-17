package com.patientrecord.repository;

import com.patientrecord.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrRecipientRoleOrderByCreatedAtDesc(Long recipientId, String recipientRole);
}
