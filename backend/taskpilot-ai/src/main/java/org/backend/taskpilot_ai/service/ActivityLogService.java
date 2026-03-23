package org.backend.taskpilot_ai.service;

import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.model.ActivityLog;
import org.backend.taskpilot_ai.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public void log(Long meetingId, String step, String action, String status) {

        try {
            ActivityLog log = ActivityLog.builder()
                    .meetingId(meetingId)
                    .step(step)
                    .action(action)
                    .status(status)
                    .timestamp(LocalDateTime.now())
                    .build();

            activityLogRepository.save(log);

        } catch (Exception e) {
            // 🔥 NEVER break system because logging failed
            System.out.println("Logging failed: " + e.getMessage());
        }
    }
}