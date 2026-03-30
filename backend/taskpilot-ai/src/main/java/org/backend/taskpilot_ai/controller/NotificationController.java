package org.backend.taskpilot_ai.controller;

import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.model.Notification;
import org.backend.taskpilot_ai.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class NotificationController {

    private final NotificationRepository repo;

    @GetMapping
    public List<Notification> getAll() {
        return repo.findByIsReadFalseOrderByCreatedAtDesc();
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable String id) {
        Notification n = repo.findById(id).orElseThrow();
        n.setIsRead(true);
        repo.save(n);
    }
}