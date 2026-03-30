package org.backend.taskpilot_ai.model;

import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder // 🔥 IMPORTANT
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    private String title;
    private String description;

    private String owner;

    private String priority;   // HIGH, MEDIUM, LOW
    private String status;     // PENDING, COMPLETED, REJECTED

    private LocalDateTime deadline;

    private String userId;     // Auth0 user
    private String meetingId;

    private Instant createdAt;
    private Instant updatedAt;

    private boolean reminderSent;
    private boolean escalated;

}