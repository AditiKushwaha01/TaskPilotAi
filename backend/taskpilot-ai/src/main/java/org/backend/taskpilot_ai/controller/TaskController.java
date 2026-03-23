package org.backend.taskpilot_ai.controller;

import org.backend.taskpilot_ai.dto.TranscriptRequest;
import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // ✅ 2. Get All Tasks
    @GetMapping("/tasks")
    public List<Task> getTasks() {
        return taskService.getAllTasks();
    }

    // ✅ 3. Update Task Status
    @PutMapping("/tasks/{id}")
    public Task updateTask(@PathVariable Long id, @RequestParam String status) {
        return taskService.updateStatus(id, status);
    }

    // ✅ 4. Get Tasks by Meeting
    @GetMapping("/tasks/meeting/{meetingId}")
    public List<Task> getTasksByMeeting(@PathVariable Long meetingId) {
        return taskService.getTasksByMeeting(meetingId);
    }
}