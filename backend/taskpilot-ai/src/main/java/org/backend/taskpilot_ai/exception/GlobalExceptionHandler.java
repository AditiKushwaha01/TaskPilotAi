package org.backend.taskpilot_ai.exception;

import lombok.extern.slf4j.Slf4j;
import org.backend.taskpilot_ai.dto.MeetingProcessResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Global Exception Handler for TaskPilot AI Application
 * Provides consistent error responses across all controllers
 *
 * This handler ensures ALL exceptions from controllers are caught and
 * returned in a consistent MeetingProcessResponse format.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle validation errors (e.g., @Valid annotation failures)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MeetingProcessResponse> handleValidationErrors(
            MethodArgumentNotValidException ex, WebRequest request) {
        log.warn("⚠️  Validation error on {}: {}", request.getDescription(false), ex.getMessage());

        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");

        return ResponseEntity.badRequest()
                .body(MeetingProcessResponse.builder()
                        .status("VALIDATION_FAILED")
                        .message("Validation Error: " + errorMessage)
                        .tasksExtracted(0)
                        .tasks(List.of())
                        .processedAt(LocalDateTime.now())
                        .build());
    }

    /**
     * Handle JSON parsing errors
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<MeetingProcessResponse> handleJsonParseErrors(
            HttpMessageNotReadableException ex, WebRequest request) {
        log.warn("⚠️  JSON parsing error on {}: {}", request.getDescription(false), ex.getMessage());

        return ResponseEntity.badRequest()
                .body(MeetingProcessResponse.builder()
                        .status("INVALID_REQUEST")
                        .message("Invalid JSON format. Please check your request body.")
                        .tasksExtracted(0)
                        .tasks(List.of())
                        .processedAt(LocalDateTime.now())
                        .build());
    }

    /**
     * Handle type mismatch errors (e.g., wrong parameter types)
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<MeetingProcessResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, WebRequest request) {
        log.warn("⚠️  Type mismatch on {}: parameter '{}' should be of type {}",
                 request.getDescription(false), ex.getName(), ex.getRequiredType().getSimpleName());

        return ResponseEntity.badRequest()
                .body(MeetingProcessResponse.builder()
                        .status("TYPE_MISMATCH")
                        .message(String.format("Parameter '%s' must be of type %s",
                                             ex.getName(), ex.getRequiredType().getSimpleName()))
                        .tasksExtracted(0)
                        .tasks(List.of())
                        .processedAt(LocalDateTime.now())
                        .build());
    }

    /**
     * Handle IllegalArgumentException (validation errors)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MeetingProcessResponse> handleIllegalArgument(
            IllegalArgumentException ex, WebRequest request) {
        log.warn("⚠️  Validation error on {}: {}", request.getDescription(false), ex.getMessage());

        return ResponseEntity.badRequest()
                .body(MeetingProcessResponse.builder()
                        .status("VALIDATION_FAILED")
                        .message("Validation Error: " + ex.getMessage())
                        .tasksExtracted(0)
                        .tasks(List.of())
                        .processedAt(LocalDateTime.now())
                        .build());
    }

    /**
     * Handle RuntimeException (business logic errors)
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<MeetingProcessResponse> handleRuntime(
            RuntimeException ex, WebRequest request) {
        log.error("❌ Runtime error on {}: {}", request.getDescription(false), ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(MeetingProcessResponse.builder()
                        .status("RUNTIME_ERROR")
                        .message("Internal Error: " + ex.getMessage())
                        .tasksExtracted(0)
                        .tasks(List.of())
                        .processedAt(LocalDateTime.now())
                        .build());
    }

    /**
     * Handle MongoDB connection errors
     */
    @ExceptionHandler(com.mongodb.MongoException.class)
    public ResponseEntity<MeetingProcessResponse> handleMongoDB(
            com.mongodb.MongoException ex, WebRequest request) {
        log.error("❌ MongoDB error on {}: {}", request.getDescription(false), ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(MeetingProcessResponse.builder()
                        .status("DATABASE_ERROR")
                        .message("Database Error: Unable to connect to MongoDB. Please check connection.")
                        .tasksExtracted(0)
                        .tasks(List.of())
                        .processedAt(LocalDateTime.now())
                        .build());
    }

    /**
     * Handle Spring Data exceptions
     */
    @ExceptionHandler(org.springframework.dao.DataAccessException.class)
    public ResponseEntity<MeetingProcessResponse> handleDataAccess(
            org.springframework.dao.DataAccessException ex, WebRequest request) {
        log.error("❌ Data access error on {}: {}", request.getDescription(false), ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(MeetingProcessResponse.builder()
                        .status("DATA_ACCESS_ERROR")
                        .message("Database operation failed: " + ex.getMessage())
                        .tasksExtracted(0)
                        .tasks(List.of())
                        .processedAt(LocalDateTime.now())
                        .build());
    }

    /**
     * Handle generic exceptions (catch-all)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<MeetingProcessResponse> handleGeneric(
            Exception ex, WebRequest request) {
        log.error("❌ Unexpected error on {}: {}", request.getDescription(false), ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(MeetingProcessResponse.builder()
                        .status("UNEXPECTED_ERROR")
                        .message("Unexpected Error: " + ex.getMessage())
                        .tasksExtracted(0)
                        .tasks(List.of())
                        .processedAt(LocalDateTime.now())
                        .build());
    }
}