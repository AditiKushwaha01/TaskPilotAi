package org.backend.taskpilot_ai.repository;

import org.backend.taskpilot_ai.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();

    List<Notification> findByMeetingIdOrderByCreatedAtDesc(String meetingId);
}