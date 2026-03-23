package org.backend.taskpilot_ai.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long meetingId;

    private Long taskId;

    private String message;

    private String type;
    // TASK_ASSIGNED, REMINDER, ESCALATION, COMPLETED, SYSTEM

    private String recipient; // user or "ALL"

    private Boolean isRead;

    private LocalDateTime createdAt;
}
