package org.backend.taskpilot_ai.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "meeting")
public class Meeting {

    @Id
    private String id;

    private String title;

    private String transcript;

    private LocalDateTime createdAt;

    private String summary;

    private String userId;

    private String userEmail;
}