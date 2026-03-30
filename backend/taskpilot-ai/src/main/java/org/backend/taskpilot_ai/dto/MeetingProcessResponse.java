package org.backend.taskpilot_ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.backend.taskpilot_ai.model.Meeting;
import org.backend.taskpilot_ai.model.Task;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for Meeting Processing endpoint
 * Contains the processed meeting and extracted tasks
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingProcessResponse {

    @JsonProperty("meeting_id")
    private String meetingId;

    @JsonProperty("meeting_title")
    private String meetingTitle;

    @JsonProperty("transcript")
    private String transcript;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("summary")
    private String summary;

    @JsonProperty("tasks_extracted")
    private int tasksExtracted;

    @JsonProperty("tasks")
    private List<TaskResponse> tasks;

    @JsonProperty("status")
    private String status; // SUCCESS, PARTIAL, FAILED

    @JsonProperty("message")
    private String message;

    @JsonProperty("processed_at")
    private LocalDateTime processedAt;

    /**
     * Convert from Meeting and Tasks to Response
     */
    public static MeetingProcessResponse fromMeetingAndTasks(Meeting meeting, List<Task> tasks) {
        return MeetingProcessResponse.builder()
                .meetingId(meeting.getId())
                .meetingTitle(meeting.getTitle())
                .transcript(meeting.getTranscript())
                .createdAt(meeting.getCreatedAt())
                .summary(meeting.getSummary())
                .tasksExtracted(tasks.size())
                .tasks(tasks.stream().map(TaskResponse::from).toList())
                .status("SUCCESS")
                .message("Meeting processed successfully")
                .processedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Create error response
     */
    public static MeetingProcessResponse error(String message) {
        return MeetingProcessResponse.builder()
                .status("FAILED")
                .message(message)
                .tasksExtracted(0)
                .tasks(List.of())
                .processedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Nested DTO for Task in response
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskResponse {
        @JsonProperty("task_id")
        private String id;

        @JsonProperty("title")
        private String title;

        @JsonProperty("owner")
        private String owner;

        @JsonProperty("deadline")
        private LocalDateTime deadline;

        @JsonProperty("status")
        private String status;

        @JsonProperty("meeting_id")
        private String meetingId;

        @JsonProperty("reminder_sent")
        private Boolean reminderSent;

        @JsonProperty("escalated")
        private Boolean escalated;

        public static TaskResponse from(Task task) {
            return TaskResponse.builder()
                    .id(task.getId())
                    .title(task.getTitle())
                    .owner(task.getOwner())
                    .deadline(task.getDeadline())
                    .status(task.getStatus())
                    .meetingId(task.getMeetingId())
                    .reminderSent(task.isReminderSent())
                    .escalated(task.isEscalated())
                    .build();
        }
    }
}

