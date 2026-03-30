package org.backend.taskpilot_ai.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.dto.TaskDTO;
import org.backend.taskpilot_ai.model.Meeting;
import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class MeetingService {

    private final AIService aiService;
    private final TaskAgent taskAgent;
    private final MeetingRepository meetingRepository;
    private final ActivityLogService logService;
    private final SummaryAgent summaryAgent;
    private final ReminderAgent reminderAgent;

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @PostConstruct
    public void printMongoUri() {
        System.out.println("🔥 MONGO URI: " + mongoUri);

        // Additional MongoDB diagnostics using the mongoUri field
        try {
            if (mongoUri != null && !mongoUri.isEmpty()) {
                System.out.println("✅ MongoDB URI configured successfully");
                System.out.println("📊 URI contains SSL: " + mongoUri.contains("ssl=true"));
                System.out.println("📊 URI contains replicaSet: " + mongoUri.contains("replicaSet"));
                System.out.println("📊 URI contains authSource: " + mongoUri.contains("authSource"));
            } else {
                System.err.println("⚠️  MongoDB URI is not configured");
            }
        } catch (Exception e) {
            System.err.println("❌ Error analyzing MongoDB URI: " + e.getMessage());
        }
    }

    public List<Task> processMeeting(String transcript) {

        //step check for start
        System.out.println("🚀 Processing meeting started");

        // ✅ STEP 1: VALIDATION
        if (transcript == null || transcript.trim().isEmpty()) {
            logService.log(null, "VALIDATION_AGENT", "Empty transcript received", "FAILED");
            throw new IllegalArgumentException("Transcript cannot be empty");
        }

        // ✅ STEP 2: CREATE MEETING FIRST (CRITICAL)
        Meeting meeting = Meeting.builder()
                .title("Meeting " + LocalDateTime.now())
                .transcript(transcript)
                .createdAt(LocalDateTime.now())
                .build();

        meetingRepository.save(meeting);
        String meetingId = meeting.getId();

        logService.log(meetingId, "MEETING_AGENT", "Meeting created", "SUCCESS");

        //step check for saving meeting
        System.out.println("✅ Meeting created with ID: " + meetingId);

        try {
            logService.log(meetingId, "AI_AGENT", "Starting task extraction", "STARTED");

            //step check for AI
            System.out.println("🤖 Calling AI service...");

            // ✅ STEP 3: AI + FALLBACK
            List<TaskDTO> extracted;

            try {
                extracted = aiService.extractTasks(transcript, meetingId);
            } catch (Exception e) {
                logService.log(meetingId, "AI_AGENT", "AI failed, using fallback", "WARNING");
                extracted = aiService.fallbackExtract(transcript);
            }

            if (extracted == null || extracted.isEmpty()) {
                logService.log(meetingId, "AI_AGENT", "No tasks found", "WARNING");

                summaryAgent.generateEmptySummary(meeting);
                return List.of();
            }

            logService.log(meetingId, "AI_AGENT",
                    "Extracted " + extracted.size() + " tasks",
                    "SUCCESS");

            //step check for extraction
            System.out.println("📦 Extracted tasks: " + extracted.size());

            // ✅ STEP 4: TASK AGENT (IMPORTANT)
            List<Task> tasks = taskAgent.assign(
                    extracted.stream().map(dto ->
                            Task.builder()
                                    .title(dto.getTitle())
                                    .owner(dto.getOwner())
                                    .deadline(dto.getDeadline())
                                    .build()
                    ).toList(),
                    meeting   // ✅ THIS WAS MISSING
            );

            //step check for task agent
            System.out.println("🧠 TaskAgent processed tasks: " + tasks.size());

            // ✅ STEP 5: SUMMARY AGENT
            summaryAgent.generateSummary(meeting, tasks);

            // ✅ STEP 6: TRIGGER REMINDER AGENT (NEW)
            // Trigger reminder checks after new tasks are created
            try {
                logService.log(meetingId, "REMINDER_AGENT", "Triggering reminder checks for new tasks", "STARTED");
                reminderAgent.checkDeadlines();
                logService.log(meetingId, "REMINDER_AGENT", "Reminder checks completed", "SUCCESS");
                System.out.println("🔥 Reminder agent triggered after meeting processing");
            } catch (Exception reminderError) {
                logService.log(meetingId, "REMINDER_AGENT", "Error during reminder checks: " + reminderError.getMessage(), "WARNING");
                System.out.println("⚠️  Reminder agent failed but meeting processing continued: " + reminderError.getMessage());
            }

            logService.log(meetingId, "SYSTEM", "Meeting processing completed", "SUCCESS");
            //step check for completion
            System.out.println("✅ Meeting processing completed");

            return tasks;

        } catch (Exception e) {

            logService.log(
                    meetingId,
                    "SYSTEM_ERROR",
                    e.getMessage(),
                    "FAILED"
            );

            throw new RuntimeException("Failed to process meeting: " + e.getMessage());
        }

    }
}