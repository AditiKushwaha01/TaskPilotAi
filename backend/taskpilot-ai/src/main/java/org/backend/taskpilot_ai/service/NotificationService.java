package org.backend.taskpilot_ai.service;

import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.model.Notification;
import org.backend.taskpilot_ai.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repo;

    //actually sends the notification
    public void notify(String meetingId, String taskId, String message, String type, String recipient) {

        try {
            Notification n = Notification.builder()
                    .meetingId(meetingId)
                    .taskId(taskId)
                    .message(message)
                    .type(type)
                    .recipient(recipient)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            repo.save(n);

        } catch (Exception e) {
            System.out.println("Notification failed: " + e.getMessage());
        }
    }
}