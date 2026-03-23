package org.backend.taskpilot_ai.repository;

import org.backend.taskpilot_ai.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();

    List<Notification> findByMeetingIdOrderByCreatedAtDesc(Long meetingId);
}