package com.university.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    // Getters and Setters (required for Spring to work)
    private String message;

    // Default constructor (required by Spring)
    public LoginResponse() {}

    // Parameterized constructor
    public LoginResponse(String message) {
        this.message = message;
    }

}
