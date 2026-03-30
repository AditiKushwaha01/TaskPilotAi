package org.backend.taskpilot_ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.backend.taskpilot_ai.dto.TaskDTO;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AIService {

    private final ActivityLogService logService;
    private final ObjectMapper mapper = new ObjectMapper();

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String AI_URL = "http://localhost:8000/extract-tasks";

    public List<TaskDTO> extractTasks(String transcript, String meetingId) {

        if (transcript == null || transcript.trim().isEmpty()) {
            throw new RuntimeException("Transcript cannot be empty");
        }

        try {
            logService.log(meetingId, "AI_AGENT", "Sending request to AI", "STARTED");

            String requestJson = mapper.writeValueAsString(
                    Map.of("transcript", transcript)
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(AI_URL, entity, String.class);

            String body = response.getBody();

            System.out.println("🤖 AI RAW RESPONSE: " + body);

            logService.log(null, "AI_AGENT", "AI response received", "SUCCESS");

            return parseTasks(body);

        } catch (Exception e) {

            System.out.println("⚠️ AI FAILED: " + e.getMessage());

            logService.log(null, "AI_AGENT",
                    "AI failed: " + e.getMessage(),
                    "FAILED"
            );

            // fallback WITH LOG
            List<TaskDTO> fallback = fallbackExtract(transcript);

            logService.log(null, "AI_AGENT",
                    "Fallback used. Tasks: " + fallback.size(),
                    "WARNING"
            );

            return fallback;
        }
    }
    public List<TaskDTO> fallbackExtract(String transcript) {

        //step check
        System.out.println("⚙️ Using fallback extraction...");

        List<TaskDTO> tasks = new ArrayList<>();

        String[] lines = transcript.split("\\.");

        for (String line : lines) {

            if (line.toLowerCase().contains("will") ||
                    line.toLowerCase().contains("todo") ||
                    line.toLowerCase().contains("action")) {

                TaskDTO t = new TaskDTO();

                t.setTitle(line.trim());
                t.setOwner("UNASSIGNED");
                t.setDeadline(LocalDateTime.now().plusDays(2));

                tasks.add(t);
            }
        }

        return tasks;
    }

    private List<TaskDTO> parseTasks(String json) {

        List<TaskDTO> tasks = new ArrayList<>();

        try {
            JsonNode array = mapper.readTree(json);

            if (!array.isArray()) return tasks;

            for (JsonNode node : array) {

                try {
                    TaskDTO t = new TaskDTO();

                    t.setTitle(getSafeText(node, "title", "Untitled Task"));
                    t.setOwner(getSafeText(node, "owner", "UNASSIGNED"));

                    String deadlineStr = getSafeText(node, "deadline", null);

                    if (deadlineStr != null) {
                        t.setDeadline(parseDate(deadlineStr));
                    } else {
                        t.setDeadline(LocalDateTime.now().plusDays(2));
                    }

                    tasks.add(t);

                } catch (Exception ignored) {
                    // skip only bad task, not whole batch
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Parsing failed: " + e.getMessage());
        }

        return tasks;
    }

    private String getSafeText(JsonNode node, String field, String defaultVal) {
        return node.hasNonNull(field) ? node.get(field).asText() : defaultVal;
    }

    private LocalDateTime parseDate(String dateStr) {
        try {
            if (dateStr.length() == 10) {
                return LocalDate.parse(dateStr).atStartOfDay();
            }
            return LocalDateTime.parse(dateStr);
        } catch (Exception e) {
            return LocalDateTime.now().plusDays(2);
        }
    }
}