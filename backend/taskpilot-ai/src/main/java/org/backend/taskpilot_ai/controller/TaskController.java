package org.backend.taskpilot_ai.controller;

import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.service.TaskService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@SuppressWarnings("unused")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // ✅ 3. Update Task Status
    @PutMapping("/tasks/{id}")
    public Task updateTask(@PathVariable String id, @RequestParam String status) {
        return taskService.updateStatus(id, status);
    }

    // ✅ 4. Get Tasks by Meeting
    @GetMapping("/tasks/meeting/{meetingId}")
    public List<Task> getTasksByMeeting(@PathVariable String meetingId) {
        return taskService.getTasksByMeeting(meetingId);
    }

    @GetMapping("/tasks/my")
    public List<Task> getMyTasks(@AuthenticationPrincipal Jwt jwt) {

        // Auth0 user ID
        String userId = jwt.getSubject();

        return taskService.getTasks(userId);
    }

    @PostMapping("/tasks/bulk")
    public List<Task> saveTasks(@RequestBody List<Task> tasks,
                                @AuthenticationPrincipal Jwt jwt) {

        String userId = jwt.getSubject();

        return taskService.saveTasks(tasks, userId);
    }
}