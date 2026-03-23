package org.backend.taskpilot_ai.service;

import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.model.Meeting;
import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.repository.MeetingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SummaryAgent {

    private final ActivityLogService logService;
    private final MeetingRepository meetingRepository;

    public void generateSummary(Meeting meeting, List<Task> tasks) {

        if (meeting == null) return;

        if (tasks == null || tasks.isEmpty()) {
            generateEmptySummary(meeting);
            return;
        }

        try {
            String summary = buildSummary(tasks);

            // ✅ Persist summary in Meeting
            meeting.setSummary(summary);
            meetingRepository.save(meeting);

            // ✅ Log
            logService.log(
                    meeting.getId(),
                    "SUMMARY_AGENT",
                    summary,
                    "SUCCESS"
            );

        } catch (Exception e) {
            logService.log(
                    meeting.getId(),
                    "SUMMARY_AGENT",
                    "Summary generation failed",
                    "FAILED"
            );
        }
    }

    public void generateEmptySummary(Meeting meeting) {

        String summary = "No actionable tasks were identified from this meeting. " +
                "Consider refining discussion points or AI extraction.";

        meeting.setSummary(summary);
        meetingRepository.save(meeting);

        logService.log(
                meeting.getId(),
                "SUMMARY_AGENT",
                summary,
                "WARNING"
        );
    }

    private String buildSummary(List<Task> tasks) {

        int total = tasks.size();

        long pending = tasks.stream()
                .filter(t -> "PENDING".equalsIgnoreCase(t.getStatus()))
                .count();

        long completed = tasks.stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .count();

        long overdue = tasks.stream()
                .filter(t -> t.getDeadline() != null &&
                        t.getDeadline().isBefore(LocalDateTime.now()) &&
                        !"COMPLETED".equalsIgnoreCase(t.getStatus()))
                .count();

        // Owner distribution
        Map<String, Long> ownerMap = tasks.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getOwner() != null ? t.getOwner() : "UNASSIGNED",
                        Collectors.counting()
                ));

        String topOwner = ownerMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        return "Meeting Summary: " +
                total + " tasks identified. " +
                pending + " pending, " +
                completed + " completed. " +
                overdue + " overdue tasks. " +
                "Most tasks assigned to: " + topOwner + ".";
    }
}