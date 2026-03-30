package org.backend.taskpilot_ai.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.backend.taskpilot_ai.dto.MeetingProcessResponse;
import org.backend.taskpilot_ai.dto.TranscriptRequest;
import org.backend.taskpilot_ai.model.ActivityLog;
import org.backend.taskpilot_ai.model.Meeting;
import org.backend.taskpilot_ai.model.Notification;
import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.repository.ActivityLogRepository;
import org.backend.taskpilot_ai.repository.MeetingRepository;
import org.backend.taskpilot_ai.repository.NotificationRepository;
import org.backend.taskpilot_ai.service.MeetingService;
import org.backend.taskpilot_ai.service.ReminderAgent;
import org.backend.taskpilot_ai.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

/**
 * API Controller for Meeting Management
 * Handles meeting transcript processing and task extraction
 */
@Slf4j
@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;
    private final MeetingRepository meetingRepository;
    private final ActivityLogRepository activityLogRepository;
    private final NotificationRepository notificationRepository;
    private final ReminderAgent reminderAgent;
    private final TaskService taskService;

    /**
     * Process a meeting transcript and extract tasks
     * 
     * @param request TranscriptRequest containing the meeting transcript
     * @return MeetingProcessResponse with extracted tasks and meeting details
     * Example Request:
     * POST /api/meetings/process
     * {
     *   "transcript": "In this meeting we discussed..."
     * }
     */
    @PostMapping("/process")
    public ResponseEntity<MeetingProcessResponse> processMeeting(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody TranscriptRequest request) {

        try {
            String userId = jwt.getSubject();
            String email = jwt.getClaim("email");

            if (request == null || request.getTranscript() == null || request.getTranscript().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(MeetingProcessResponse.error("Transcript cannot be empty"));
            }

            String transcript = request.getTranscript().trim();

            // 🔥 PROCESS AI (with fallback already inside service)
            List<Task> tasks = meetingService.processMeeting(transcript);

            // ✅ GET CREATED MEETING (LAST ONE SAFELY)
            Meeting meeting = meetingRepository.findAll()
                    .stream()
                    .reduce((first, second) -> second) // get last
                    .orElse(null);

            if (meeting == null) {
                return ResponseEntity.status(500)
                        .body(MeetingProcessResponse.error("Meeting not created"));
            }

            // ✅ ATTACH USER
            meeting.setUserId(userId);
            meeting.setUserEmail(email);
            meetingRepository.save(meeting);

            return ResponseEntity.ok(
                    MeetingProcessResponse.fromMeetingAndTasks(meeting, tasks)
            );

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(MeetingProcessResponse.error("Error: " + e.getMessage()));
        }
    }
    /**
     * Get meeting details by ID
     * 
     * @param meetingId The ID of the meeting
     * @return MeetingProcessResponse with meeting details
     */
    @GetMapping("/{meetingId}")
    public ResponseEntity<MeetingProcessResponse> getMeeting(
            @PathVariable String meetingId,
            @AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt) {

        // 🔐 Get logged-in user
        String userId = jwt.getSubject();

        // Validate input
        if (meetingId == null || meetingId.trim().isEmpty()) {
            log.warn("⚠️ Invalid meeting ID provided: {}", meetingId);
            return ResponseEntity.badRequest()
                    .body(MeetingProcessResponse.error("Meeting ID cannot be null or empty"));
        }

        String trimmedMeetingId = meetingId.trim();
        log.info("📖 Fetching meeting with ID: {} for user: {}", trimmedMeetingId, userId);

        try {
            // Fetch meeting
            Meeting meeting = meetingRepository.findById(trimmedMeetingId).orElse(null);

            if (meeting == null) {
                log.warn("⚠️ Meeting not found: {}", trimmedMeetingId);
                return ResponseEntity.notFound().build();
            }

            // 🔥 SECURITY CHECK (MOST IMPORTANT)
            if (!userId.equals(meeting.getUserId())) {
                log.error("🚫 Unauthorized access attempt by user {} for meeting {}", userId, trimmedMeetingId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(MeetingProcessResponse.error("You are not allowed to access this meeting"));
            }

            // For now empty tasks (you can improve later)
            List<Task> tasks = new java.util.ArrayList<>();

            MeetingProcessResponse response =
                    MeetingProcessResponse.fromMeetingAndTasks(meeting, tasks);

            log.info("✅ Meeting fetched successfully: {}", trimmedMeetingId);

            return ResponseEntity.ok(response);

        } catch (com.mongodb.MongoException e) {
            log.error("❌ MongoDB error fetching meeting {}: {}", trimmedMeetingId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MeetingProcessResponse.error("Database error"));

        } catch (Exception e) {
            log.error("❌ Unexpected error fetching meeting {}: {}", trimmedMeetingId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(MeetingProcessResponse.error("Unexpected error"));
        }
    }

    @GetMapping("/{meetingId}/tasks")
    public List<Task> getTasksByMeeting(@PathVariable String meetingId) {
        return taskService.getTasksByMeeting(meetingId);
    }

    /**
     * Get notifications for a specific meeting
     * Uses NotificationRepository.findByMeetingIdOrderByCreatedAtDesc()
     * 
     * @param meetingId The ID of the meeting
     * @return List of notifications for the meeting
     */
    @GetMapping("/{meetingId}/notifications")
    public ResponseEntity<List<Notification>> getMeetingNotifications(@PathVariable String meetingId) {
        // Validate input
        if (meetingId == null || meetingId.trim().isEmpty()) {
            log.warn("⚠️  Invalid meeting ID for notifications: {}", meetingId);
            return ResponseEntity.badRequest().build();
        }

        String trimmedMeetingId = meetingId.trim();
        log.info("📢 Fetching notifications for meeting: {}", trimmedMeetingId);

        try {
            // Verify meeting exists
            boolean meetingExists = meetingRepository.existsById(trimmedMeetingId);
            if (!meetingExists) {
                log.warn("⚠️  Meeting not found: {}", trimmedMeetingId);
                return ResponseEntity.notFound().build();
            }

            // Use the repository method
            List<Notification> notifications = notificationRepository.findByMeetingIdOrderByCreatedAtDesc(trimmedMeetingId);

            // Ensure we return a non-null list
            if (notifications == null) {
                notifications = new java.util.ArrayList<>();
            }

            log.info("✅ Found {} notifications for meeting: {}", notifications.size(), trimmedMeetingId);
            return ResponseEntity.ok(notifications);

        } catch (com.mongodb.MongoException e) {
            log.error("❌ MongoDB error fetching notifications for meeting {}: {}", trimmedMeetingId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        } catch (org.springframework.dao.DataAccessException e) {
            log.error("❌ Data access error fetching notifications for meeting {}: {}", trimmedMeetingId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        } catch (IllegalArgumentException e) {
            log.warn("⚠️  Invalid argument fetching notifications for meeting {}: {}", trimmedMeetingId, e.getMessage());
            return ResponseEntity.badRequest().build();

        } catch (Exception e) {
            log.error("❌ Unexpected error fetching notifications for meeting {}: {}", trimmedMeetingId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get activity logs for a specific meeting
     * Uses ActivityLogRepository.findByMeetingId()
     * 
     * @param meetingId The ID of the meeting
     * @return List of activity logs for the meeting
     */
    @GetMapping("/{meetingId}/activity")
    public ResponseEntity<List<ActivityLog>> getMeetingActivity(@PathVariable String meetingId) {
        // Validate input
        if (meetingId == null || meetingId.trim().isEmpty()) {
            log.warn("⚠️  Invalid meeting ID for activity logs: {}", meetingId);
            return ResponseEntity.badRequest().build();
        }

        String trimmedMeetingId = meetingId.trim();
        log.info("📊 Fetching activity logs for meeting: {}", trimmedMeetingId);

        try {
            // Verify meeting exists
            boolean meetingExists = meetingRepository.existsById(trimmedMeetingId);
            if (!meetingExists) {
                log.warn("⚠️  Meeting not found: {}", trimmedMeetingId);
                return ResponseEntity.notFound().build();
            }

            // Use the repository method
            List<ActivityLog> activityLogs = activityLogRepository.findByMeetingId(trimmedMeetingId);

            // Ensure we return a non-null list
            if (activityLogs == null) {
                activityLogs = new java.util.ArrayList<>();
            }

            log.info("✅ Found {} activity logs for meeting: {}", activityLogs.size(), trimmedMeetingId);
            return ResponseEntity.ok(activityLogs);

        } catch (com.mongodb.MongoException e) {
            log.error("❌ MongoDB error fetching activity logs for meeting {}: {}", trimmedMeetingId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        } catch (org.springframework.dao.DataAccessException e) {
            log.error("❌ Data access error fetching activity logs for meeting {}: {}", trimmedMeetingId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        } catch (IllegalArgumentException e) {
            log.warn("⚠️  Invalid argument fetching activity logs for meeting {}: {}", trimmedMeetingId, e.getMessage());
            return ResponseEntity.badRequest().build();

        } catch (Exception e) {
            log.error("❌ Unexpected error fetching activity logs for meeting {}: {}", trimmedMeetingId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get activity logs by step type
     * Uses ActivityLogRepository.findByStep()
     * 
     * @param step The step type (e.g., "TASK_EXTRACTION", "ESCALATION")
     * @return List of activity logs for the step
     */
    @GetMapping("/activity/step/{step}")
    public ResponseEntity<List<ActivityLog>> getActivityByStep(@PathVariable String step) {
        // Validate input
        if (step == null || step.trim().isEmpty()) {
            log.warn("⚠️  Invalid step type provided: {}", step);
            return ResponseEntity.badRequest().build();
        }

        String trimmedStep = step.trim();
        log.info("🔍 Fetching activity logs for step: {}", trimmedStep);

        try {
            // Use the repository method
            List<ActivityLog> activityLogs = activityLogRepository.findByStep(trimmedStep);

            // Ensure we return a non-null list
            if (activityLogs == null) {
                activityLogs = new java.util.ArrayList<>();
            }

            log.info("✅ Found {} activity logs for step: {}", activityLogs.size(), trimmedStep);
            return ResponseEntity.ok(activityLogs);

        } catch (com.mongodb.MongoException e) {
            log.error("❌ MongoDB error fetching activity logs for step {}: {}", trimmedStep, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        } catch (org.springframework.dao.DataAccessException e) {
            log.error("❌ Data access error fetching activity logs for step {}: {}", trimmedStep, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        } catch (IllegalArgumentException e) {
            log.warn("⚠️  Invalid argument fetching activity logs for step {}: {}", trimmedStep, e.getMessage());
            return ResponseEntity.badRequest().build();

        } catch (Exception e) {
            log.error("❌ Unexpected error fetching activity logs for step {}: {}", trimmedStep, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Trigger reminder agent manually (for testing)
     * Uses ReminderAgent.checkDeadlines()
     * 
     * @return Status message
     */
    @PostMapping("/reminders/trigger")
    public ResponseEntity<String> triggerReminders() {
        log.info("🔥 Manually triggering reminder agent");

        try {
            // Trigger the reminder agent (normally runs on schedule)
            reminderAgent.checkDeadlines();

            log.info("✅ Reminder agent triggered successfully");
            return ResponseEntity.ok("Reminder agent triggered successfully ✅");

        } catch (com.mongodb.MongoException e) {
            log.error("❌ MongoDB error during reminder trigger: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Database error during reminder trigger: " + e.getMessage());

        } catch (org.springframework.dao.DataAccessException e) {
            log.error("❌ Data access error during reminder trigger: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Database operation failed during reminder trigger: " + e.getMessage());

        } catch (RuntimeException e) {
            log.error("❌ Runtime error during reminder trigger: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Reminder trigger failed: " + e.getMessage());

        } catch (Exception e) {
            log.error("❌ Unexpected error during reminder trigger: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error during reminder trigger: " + e.getMessage());
        }
    }

    /**
     * Get all notifications (uses NotificationController.getAll())
     * 
     * @return List of all unread notifications
     */
    @GetMapping("/notifications/all")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        log.info("📢 Fetching all notifications");

        try {
            // This mimics NotificationController.getAll() functionality
            List<Notification> notifications = notificationRepository.findByIsReadFalseOrderByCreatedAtDesc();

            // Ensure we return a non-null list
            if (notifications == null) {
                notifications = new java.util.ArrayList<>();
            }

            log.info("✅ Found {} unread notifications", notifications.size());
            return ResponseEntity.ok(notifications);

        } catch (com.mongodb.MongoException e) {
            log.error("❌ MongoDB error fetching all notifications: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        } catch (org.springframework.dao.DataAccessException e) {
            log.error("❌ Data access error fetching all notifications: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        } catch (IllegalArgumentException e) {
            log.warn("⚠️  Invalid argument fetching all notifications: {}", e.getMessage());
            return ResponseEntity.badRequest().build();

        } catch (Exception e) {
            log.error("❌ Unexpected error fetching all notifications: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Mark notification as read (uses NotificationController.markAsRead())
     * 
     * @param notificationId The ID of the notification to mark as read
     * @return Success message
     */
    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<String> markNotificationAsRead(@PathVariable String notificationId) {
        // Validate input
        if (notificationId == null || notificationId.trim().isEmpty()) {
            log.warn("⚠️  Invalid notification ID provided: {}", notificationId);
            return ResponseEntity.badRequest()
                    .body("Notification ID cannot be null or empty");
        }

        String trimmedNotificationId = notificationId.trim();
        log.info("📖 Marking notification as read: {}", trimmedNotificationId);

        try {
            Notification notification = notificationRepository.findById(trimmedNotificationId).orElse(null);

            if (notification == null) {
                log.warn("⚠️  Notification not found: {}", trimmedNotificationId);
                return ResponseEntity.notFound().build();
            }

            // This mimics NotificationController.markAsRead() functionality
            notification.setIsRead(true);
            notificationRepository.save(notification);

            log.info("✅ Notification marked as read: {}", trimmedNotificationId);
            return ResponseEntity.ok("Notification marked as read ✅");

        } catch (com.mongodb.MongoException e) {
            log.error("❌ MongoDB error marking notification as read {}: {}", trimmedNotificationId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Database error marking notification as read: " + e.getMessage());

        } catch (org.springframework.dao.DataAccessException e) {
            log.error("❌ Data access error marking notification as read {}: {}", trimmedNotificationId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Database operation failed marking notification as read: " + e.getMessage());

        } catch (IllegalArgumentException e) {
            log.warn("⚠️  Invalid argument marking notification as read {}: {}", trimmedNotificationId, e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Invalid request: " + e.getMessage());

        } catch (Exception e) {
            log.error("❌ Unexpected error marking notification as read {}: {}", trimmedNotificationId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error marking notification as read: " + e.getMessage());
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Meeting Controller is up and running ✅");
    }

    /**
     * Test endpoint to verify GlobalExceptionHandler is working
     * This endpoint intentionally throws different exceptions to test the handler
     */
    @GetMapping("/test-exception/{type}")
    public ResponseEntity<String> testException(@PathVariable String type) {
        switch (type.toLowerCase()) {
            case "illegalargument":
                throw new IllegalArgumentException("Test validation error from MeetingController");

            case "runtime":
                throw new RuntimeException("Test runtime error from MeetingController");

            case "mongodb":
                throw new com.mongodb.MongoException("Test MongoDB error from MeetingController");

            case "dataaccess":
                throw new org.springframework.dao.DataAccessException("Test data access error from MeetingController") {};

            default:
                throw new RuntimeException("Test generic error from MeetingController");
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Meeting>> getMyMeetings(
            @AuthenticationPrincipal Jwt jwt) {

        try {
            String userId = jwt.getSubject();

            List<Meeting> meetings = meetingRepository.findByUserId(userId);

            return ResponseEntity.ok(meetings);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}

