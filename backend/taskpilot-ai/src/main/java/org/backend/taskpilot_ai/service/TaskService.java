package org.backend.taskpilot_ai.service;

import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskAgent taskAgent;


    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task updateStatus(Long id, String status) {

        String normalizedStatus = status.toUpperCase();

        if (!List.of("PENDING", "COMPLETED", "REJECTED").contains(normalizedStatus)) {
            throw new RuntimeException("Invalid status: " + status);
        }

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        task.setStatus(normalizedStatus);

        Task savedTask = taskRepository.save(task);

        // ✅ 🔥 CONNECT AGENT HERE
        taskAgent.handleTaskCompletion(savedTask);

        return savedTask;
    }
    public List<Task> getTasksByMeeting(Long meetingId) {
        return taskRepository.findByMeetingId(meetingId);
    }
}