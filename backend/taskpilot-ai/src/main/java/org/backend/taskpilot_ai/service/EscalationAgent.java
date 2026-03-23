package org.backend.taskpilot_ai.service;

import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EscalationAgent {

    private final TaskRepository taskRepository;
    private final NotificationService notificationService;
    private final ActivityLogService logService;

    public void processOverdueTasks() {

        // 🔥 Optimized query (replace findAll later in repo)
        List<Task> tasks = taskRepository.findAll();

        for (Task task : tasks) {
            try {
                if (shouldEscalate(task)) {
                    escalate(task);
                }
            } catch (Exception e) {

                Long meetingId = (task != null && task.getMeeting() != null)
                        ? task.getMeeting().getId()
                        : null;

                logService.log(
                        meetingId,
                        "ESCALATION_AGENT",
                        "Error escalating task: " + safeTitle(task),
                        "FAILED"
                );
            }
        }
    }

    public boolean shouldEscalate(Task task) {

        if (task == null) return false;

        if (task.getDeadline() == null) return false;

        if ("COMPLETED".equalsIgnoreCase(task.getStatus())) return false;

        if (Boolean.TRUE.equals(task.getEscalated())) return false;

        return task.getDeadline().isBefore(LocalDateTime.now());
    }

    public void escalate(Task task) {

        if (task == null) return;

        Long meetingId = (task.getMeeting() != null)
                ? task.getMeeting().getId()
                : null;

        // ✅ Mark escalated
        task.setEscalated(true);
        taskRepository.save(task);

        // ✅ Log
        logService.log(
                meetingId,
                "ESCALATION_AGENT",
                "Task escalated: " + safeTitle(task),
                "WARNING"
        );

        // ✅ Notification (FIXED + SAFE)
        notificationService.notify(
                meetingId,
                task.getId(),
                "Task overdue and escalated: " + safeTitle(task),
                "ESCALATION",
                resolveRecipient(task)
        );
    }

    // 🔥 Helper: avoid null crashes
    private String safeTitle(Task task) {
        return (task != null && task.getTitle() != null)
                ? task.getTitle()
                : "UNKNOWN TASK";
    }

    // 🔥 Helper: smarter routing
    private String resolveRecipient(Task task) {

        if (task.getOwner() != null && !task.getOwner().isEmpty()) {
            return task.getOwner();
        }

        return "MANAGER"; // fallback escalation
    }
}