package org.backend.taskpilot_ai.service;

import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.repository.TaskRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReminderAgent {

    private final TaskRepository repo;
    private final EscalationAgent escalationAgent;
    private final ActivityLogService logService;
    private final NotificationService notificationService;

    @Scheduled(fixedRate = 60000) // every 1 min
    public void checkDeadlines() {

        List<Task> tasks = repo.findAll(); // later optimize query

        for (Task t : tasks) {
            try {
                if (shouldSendReminder(t)) {
                    sendReminder(t);
                }

                // IMPORTANT: do NOT call escalate directly
                // delegate to escalation agent logic
                if (escalationAgent.shouldEscalate(t)) {
                    escalationAgent.escalate(t);
                }

            } catch (Exception e) {
                logService.log(
                        t.getMeeting().getId(),
                        "REMINDER_AGENT",
                        "Error processing task: " + t.getTitle(),
                        "FAILED"
                );
            }
        }
    }

    private boolean shouldSendReminder(Task t) {

        if (t == null) return false;

        // Null safety
        if (t.getDeadline() == null) return false;

        // Status check (safe)
        if (!"PENDING".equalsIgnoreCase(t.getStatus())) return false;

        // Already reminded (CRITICAL)
        if (Boolean.TRUE.equals(t.getReminderSent())) return false;

        // Within next 24 hours
        return t.getDeadline().isBefore(LocalDateTime.now().plusHours(24));
    }

    private void sendReminder(Task t) {

        // mark reminder sent
        t.setReminderSent(true);
        repo.save(t);

        // log action
        logService.log(
                t.getMeeting().getId(),
                "REMINDER_AGENT",
                "Reminder sent for task: " + t.getTitle(),
                "SUCCESS"
        );

        notificationService.notify(
                t.getMeeting().getId(),
                t.getId(),
                "Reminder: Task nearing deadline - " + t.getTitle(),
                "REMINDER",
                t.getOwner()
        );

        System.out.println("Reminder sent: " + t.getTitle());
    }

}