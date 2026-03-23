package org.backend.taskpilot_ai.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long meetingId;

    private String step;     // e.g. "TASK_EXTRACTION", "ESCALATION"
    private String action;   // what happened
    private String status;   // SUCCESS / FAILED

    private LocalDateTime timestamp;

    public void setTime(LocalDateTime now) {

    }
}