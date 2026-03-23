package org.backend.taskpilot_ai.repository;

import org.backend.taskpilot_ai.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
}
