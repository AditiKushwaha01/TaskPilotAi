package org.backend.taskpilot_ai.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notify")
public class Notification {

    @Id
    private String id;

    private String meetingId;

    private String taskId;

    private String message;

    private String type;
    // TASK_ASSIGNED, REMINDER, ESCALATION, COMPLETED, SYSTEM

    private String recipient; // user or "ALL"

    private Boolean isRead;

    private LocalDateTime createdAt;
}
