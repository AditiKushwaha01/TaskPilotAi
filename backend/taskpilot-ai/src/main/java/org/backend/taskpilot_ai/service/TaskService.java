package org.backend.taskpilot_ai.service;

import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskAgent taskAgent;

    // ❌ REMOVE global access (security fix)
    // public List<Task> getAllTasks()

    // ✅ USER-SPECIFIC TASKS (sorted DESC)
    public List<Task> getTasks(String userId) {
        return taskRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ✅ GET BY MEETING
    public List<Task> getTasksByMeeting(String meetingId) {
        return taskRepository.findByMeetingId(meetingId);
    }

    // ✅ UPDATE STATUS
    public Task updateStatus(String id, String status) {

        String normalizedStatus = status.toUpperCase();

        if (!List.of("PENDING", "COMPLETED", "REJECTED").contains(normalizedStatus)) {
            throw new RuntimeException("Invalid status: " + status);
        }

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        task.setStatus(normalizedStatus);
        task.setUpdatedAt(Instant.now()); // 🔥 IMPORTANT FIX

        Task savedTask = taskRepository.save(task);

        // 🔥 Trigger agent (if needed)
        taskAgent.handleTaskCompletion(savedTask);

        return savedTask;
    }

    // ✅ CREATE TASK (IMPORTANT for AI integration)
    public Task createTask(Task task, String userId) {
        task.setUserId(userId);
        task.setStatus("PENDING");
        task.setCreatedAt(Instant.now());
        task.setUpdatedAt(Instant.now());

        return taskRepository.save(task);
    }
    public List<Task> saveTasks(List<Task> tasks, String userId) {
        for (Task task : tasks) {
            task.setUserId(userId);
        }
        return taskRepository.saveAll(tasks);
    }
}