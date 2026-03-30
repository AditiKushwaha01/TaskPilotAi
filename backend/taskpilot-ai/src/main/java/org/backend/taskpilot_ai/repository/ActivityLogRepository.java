package org.backend.taskpilot_ai.repository;

import org.backend.taskpilot_ai.model.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {

    // 🔥 Get logs by meeting
    List<ActivityLog> findByMeetingId(String meetingId);

    // 🔥 Optional: filter by step
    List<ActivityLog> findByStep(String step);
}
