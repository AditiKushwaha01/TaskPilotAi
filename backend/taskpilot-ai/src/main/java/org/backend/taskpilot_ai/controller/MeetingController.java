package org.backend.taskpilot_ai.controller;


import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.dto.TranscriptRequest;
import org.backend.taskpilot_ai.model.Task;
import org.backend.taskpilot_ai.service.MeetingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping("/process")
    public List<Task> processMeeting(@RequestBody TranscriptRequest request) {
        return meetingService.processMeeting(request.getTranscript());
    }
}
