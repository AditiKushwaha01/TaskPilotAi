package org.backend.taskpilot_ai.repository;

import org.backend.taskpilot_ai.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    // 🔥 Get logs by meeting
    List<ActivityLog> findByMeetingId(Long meetingId);

    // 🔥 Optional: filter by step
    List<ActivityLog> findByStep(String step);
}
