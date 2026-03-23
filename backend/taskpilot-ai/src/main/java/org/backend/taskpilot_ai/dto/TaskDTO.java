package org.backend.taskpilot_ai.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskDTO {
    private String title;
    private String owner;
    private LocalDateTime deadline;
}
