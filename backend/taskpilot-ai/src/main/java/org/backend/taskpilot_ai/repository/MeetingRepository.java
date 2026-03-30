package org.backend.taskpilot_ai.repository;

import org.backend.taskpilot_ai.model.Meeting;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MeetingRepository extends MongoRepository<Meeting, String> {
    List<Meeting> findByUserId(String userId);
}
