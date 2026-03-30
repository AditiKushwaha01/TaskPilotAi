package org.backend.taskpilot_ai.repository;

import org.backend.taskpilot_ai.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByMeetingId(String meetingId);
    List<Task> findByDeadlineBeforeAndStatusNotIgnoreCase(
            LocalDateTime time,
            String status
    );
    List<Task> findByUserIdOrderByCreatedAtDesc(String userId);

}
