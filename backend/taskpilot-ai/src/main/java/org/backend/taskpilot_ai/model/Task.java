package org.backend.taskpilot_ai.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder // 🔥 IMPORTANT
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String owner;

    private LocalDateTime deadline;

    private String status; // PENDING, COMPLETED, REJECTED

    @ManyToOne
    @JoinColumn(name = "meeting_id")
    @JsonBackReference
    private Meeting meeting;

    private Boolean reminderSent = false;
    private Boolean escalated = false;


}