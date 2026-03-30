package org.backend.taskpilot_ai.controller;

// controller/TestController.java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test() {
        return "Secure API accessed!";
    }
}