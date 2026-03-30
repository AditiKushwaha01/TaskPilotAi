package org.backend.taskpilot_ai.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "activity")
public class ActivityLog {

    @Id
    private String id;

    private String meetingId;

    private String step;     // e.g. "TASK_EXTRACTION", "ESCALATION"
    private String action;   // what happened
    private String status;   // SUCCESS / FAILED

    private LocalDateTime timestamp;

    public void setTime(LocalDateTime now) {

    }
}