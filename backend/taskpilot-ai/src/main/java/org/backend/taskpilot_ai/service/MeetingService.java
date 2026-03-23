package org.backend.taskpilot_ai.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.dto.TaskDTO;
import org.backend.taskpilot_ai.model.Meeting;
import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.repository.MeetingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MeetingService {

    private final AIService aiService;
    private final TaskAgent taskAgent;
    private final MeetingRepository meetingRepository;
    private final ActivityLogService logService;
    private final SummaryAgent summaryAgent;

    @Transactional
    public List<Task> processMeeting(String transcript) {

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
        Long meetingId = meeting.getId();

        logService.log(meetingId, "MEETING_AGENT", "Meeting created", "SUCCESS");

        try {
            logService.log(meetingId, "AI_AGENT", "Starting task extraction", "STARTED");

            // ✅ STEP 3: AI + FALLBACK
            List<TaskDTO> extracted;

            try {
                extracted = aiService.extractTasks(transcript);
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

            // ✅ STEP 5: SUMMARY AGENT
            summaryAgent.generateSummary(meeting, tasks);

            logService.log(meetingId, "SYSTEM", "Meeting processing completed", "SUCCESS");

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