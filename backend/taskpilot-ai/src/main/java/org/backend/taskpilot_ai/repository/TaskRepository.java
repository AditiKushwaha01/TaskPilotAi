package org.backend.taskpilot_ai.repository;

import org.backend.taskpilot_ai.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByMeetingId(Long meetingId);
    List<Task> findByDeadlineBeforeAndStatusNotIgnoreCase(
            LocalDateTime time,
            String status
    );

}
