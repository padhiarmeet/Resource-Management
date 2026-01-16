package com.project.resource_management.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TempController {
    @GetMapping("/")
    public String greet() {
        return "You are in Home page !!";
    }
}
