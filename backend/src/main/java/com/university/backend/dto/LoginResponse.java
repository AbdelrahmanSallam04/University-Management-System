package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    // Getters and Setters (required for Spring to work)
    private String message;
    private String role;

    // Default constructor (required by Spring)
    public LoginResponse() {}

    public LoginResponse(String message) {
        this.message = message;
    }

    // Parameterized constructor
    public LoginResponse(String message, String role) {
        this.message = message;
        this.role = role;
    }

}
