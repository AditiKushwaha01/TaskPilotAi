package org.backend.taskpilot_ai.service;

import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.model.Meeting;
import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TaskAgent {

    private final TaskRepository repo;
    private final ActivityLogService logService;
    private final NotificationService notificationService;

    // ✅ FIX: meeting must be passed
    public List<Task> assign(List<Task> tasks, Meeting meeting) {

        if (tasks == null || tasks.isEmpty()) {
            logService.log(
                    meeting.getId(),
                    "TASK_AGENT",
                    "No tasks to assign",
                    "WARNING"
            );
            return Collections.emptyList();
        }

        List<Task> processedTasks = new ArrayList<>();
        Set<String> uniqueTasks = new HashSet<>();

        for (Task t : tasks) {
            try {
                if (!isValidTask(t)) {
                    continue;
                }

                normalizeTask(t, meeting);

                // Deduplication
                if (uniqueTasks.contains(t.getTitle().toLowerCase())) {
                    continue;
                }

                uniqueTasks.add(t.getTitle().toLowerCase());
                processedTasks.add(t);

            } catch (Exception e) {
                logService.log(
                        meeting.getId(),
                        "TASK_AGENT",
                        "Error processing task: " + t.getTitle(),
                        "FAILED"
                );
            }
        }

        List<Task> saved = repo.saveAll(processedTasks);

        logService.log(
                meeting.getId(),
                "TASK_AGENT",
                "Tasks assigned: " + saved.size(),
                "SUCCESS"
        );

        // ✅ Notification for new tasks
        notificationService.notify(
                meeting.getId(),
                null,
                saved.size() + " new tasks assigned",
                "TASK_ASSIGNED",
                "ALL"
        );

        return saved;
    }

    // ✅ Separate method for task completion (call from controller/service)
    public void handleTaskCompletion(Task task) {

        if (task == null) return;

        if ("COMPLETED".equalsIgnoreCase(task.getStatus())) {

            notificationService.notify(
                    task.getMeetingId(),
                    task.getId(),
                    "Task completed: " + task.getTitle(),
                    "COMPLETED",
                    "ALL"
            );
        }
    }

    private boolean isValidTask(Task t) {

        if (t == null) return false;

        return t.getTitle() != null && !t.getTitle().trim().isEmpty();
    }

    private void normalizeTask(Task t, Meeting meeting) {

        t.setMeetingId(meeting.getId());

        if (t.getStatus() == null) {
            t.setStatus("PENDING");
        }

        t.setStatus(t.getStatus().toUpperCase());

        if (t.getDeadline() == null) {
            t.setDeadline(LocalDateTime.now().plusDays(2));
        }

        t.setReminderSent(false);
        t.setEscalated(false);

        if (t.getOwner() == null || t.getOwner().isEmpty()) {
            t.setOwner("UNASSIGNED");
        }
    }
}